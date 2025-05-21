import { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import axios from 'axios';

// Define the registration steps
const STEPS = [
  {
    id: 'companyName',
    question: "What is your company name?",
    field: 'companyName',
    required: true
  },
  {
    id: 'areaOfService',
    question: "Where does your company operate?",
    field: 'areaOfService',
    required: false
  },
  {
    id: 'fullName',
    question: "What is your full name?",
    field: 'fullName',
    required: true
  },
  {
    id: 'email',
    question: "What is your email address?",
    field: 'email',
    required: true,
    validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    errorMessage: 'Please enter a valid email address.'
  },
  {
    id: 'phone',
    question: "What is your contact number?",
    field: 'phone',
    required: false
  },
  {
    id: 'documents',
    question: "Please upload your required documents.",
    field: 'documents',
    isFileUpload: true,
    required: false
  }
];

// Initial form values
const INITIAL_FORM_VALUES = {
  companyName: '',
  areaOfService: '',
  fullName: '',
  email: '',
  phone: '',
  documents: []
};

const AIAssistantContext = createContext();

export const useAIAssistant = () => useContext(AIAssistantContext);

export const AIAssistantProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! I'm here to help you with your registration. Let's get started!", isUser: false }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formValues, setFormValues] = useState(INITIAL_FORM_VALUES);
  const [chatHistory, setChatHistory] = useState([]);
  const submitFormRef = useRef(null);
  const messagesEndRef = useRef(null);
  const abortControllerRef = useRef(null);
  
  // Get current step
  const currentStep = STEPS[currentStepIndex];
  
  // Toggle chat window
  const toggleChat = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);
  
  // Reset the conversation
  const startOver = useCallback(() => {
    setMessages([{ text: "Let's start over. What is your company name?", isUser: false }]);
    setCurrentStepIndex(0);
    setFormValues(INITIAL_FORM_VALUES);
    setChatHistory([]);
  }, []);
  
  // Add a message to the chat
  const addMessage = useCallback((text, isUser = false) => {
    const message = { text, isUser, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, message]);
    setChatHistory(prev => [...prev, message]);
  }, []);
  
  // Update form field and move to next step
  const updateFormField = useCallback((field, value) => {
    setFormValues(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Move to next step if not a file upload
    if (currentStep && !currentStep.isFileUpload) {
      moveToNextStep();
    }
  }, [currentStep]);
  
  // Move to the next step in the registration flow
  const moveToNextStep = useCallback(() => {
    setCurrentStepIndex(prev => {
      const nextStep = prev + 1;
      if (nextStep < STEPS.length) {
        addMessage(STEPS[nextStep].question, false);
        return nextStep;
      } else {
        // All steps completed
        addMessage("Great! Ready to submit your registration? (yes/no)", false);
        return prev;
      }
    });
  }, [addMessage]);
  
  // Handle file upload completion
  const handleFileUploadComplete = useCallback(() => {
    addMessage("Documents uploaded successfully!", false);
    moveToNextStep();
  }, [addMessage, moveToNextStep]);
  
  // Set the form submission handler
  const setSubmitForm = useCallback((submitFn) => {
    submitFormRef.current = submitFn;
  }, []);
  
  // Trigger form submission
  const triggerSubmit = useCallback(async () => {
    if (submitFormRef.current) {
      try {
        setIsTyping(true);
        const result = await submitFormRef.current();
        if (result.success) {
          addMessage("Your registration has been submitted successfully!", false);
          return { success: true };
        } else {
          addMessage("There was an error submitting your registration. Please try again.", false);
          return { success: false, error: result.message };
        }
      } catch (error) {
        console.error("Submission error:", error);
        addMessage("An error occurred while submitting. Please try again.", false);
        return { success: false, error: error.message };
      } finally {
        setIsTyping(false);
      }
    }
    return { success: false, error: 'Form submission handler not found' };
  }, [addMessage]);
  
  // Handle user responses
  const handleUserResponse = useCallback(async (response) => {
    // Add user message to chat
    addMessage(response, true);
    
    // Check if we're at the confirmation step
    if (currentStepIndex >= STEPS.length - 1) {
      if (response.toLowerCase().includes('yes')) {
        await triggerSubmit();
      } else {
        addMessage("No problem! You can review and edit your information before submitting.", false);
      }
      return;
    }
    
    // Handle current step validation and processing
    const step = STEPS[currentStepIndex];
    if (step) {
      // Validate response if needed
      if (step.validate && !step.validate(response)) {
        addMessage(step.errorMessage || "Please provide a valid input.", false);
        return;
      }
      
      // Update form field and move to next step
      updateFormField(step.field, response);
    }
  }, [currentStepIndex, addMessage, updateFormField, triggerSubmit]);
  
  // Handle unexpected user input using OpenAI API
  const handleUnexpectedInput = useCallback(async (input) => {
    try {
      setIsTyping(true);
      // Call your OpenAI API endpoint here
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/ai/chat`,
        { message: input, history: chatHistory }
      );
      
      if (response.data && response.data.response) {
        addMessage(response.data.response, false);
      } else {
        addMessage("I'm not sure how to respond to that. Let's get back to your registration.", false);
        if (currentStep) {
          addMessage(currentStep.question, false);
        }
      }
    } catch (error) {
      console.error("Error calling AI API:", error);
      addMessage("I'm having trouble understanding. Let's continue with your registration.", false);
      if (currentStep) {
        addMessage(currentStep.question, false);
      }
    } finally {
      setIsTyping(false);
    }
  }, [chatHistory, currentStep, addMessage]);
  
  // Context value
  const value = {
    isOpen,
    messages,
    isTyping,
    currentStep: currentStepIndex,
    currentQuestion: currentStep?.question,
    handleUserResponse,
    handleUnexpectedInput,
    startOver,
    toggleChat,
    messagesEndRef,
    updateFormField,
    triggerSubmit,
    formValues,
    setSubmitForm,
    handleFileUploadComplete,
    addMessage
  };
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Clean up any pending requests
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);
  
  return <AIAssistantContext.Provider value={value}>{children}</AIAssistantContext.Provider>;
};
