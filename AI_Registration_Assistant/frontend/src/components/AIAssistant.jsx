import { useState, useRef, useEffect, useCallback } from 'react';
import { useAIAssistant } from '../context/AIAssistantContext';
import { FiSend, FiMessageSquare, FiX, FiRotateCcw, FiUpload } from 'react-icons/fi';

// Define the conversation steps
const STEPS = [
  {
    id: 'welcome',
    message: "Hello! I'm here to help you with your company registration. What's your company name?",
    field: 'companyName',
  },
  {
    id: 'areaOfService',
    message: 'What industry or area does your company operate in?',
    field: 'areaOfService',
    optional: true,
  },
  {
    id: 'fullName',
    message: 'What\'s your full name?',
    field: 'fullName',
  },
  {
    id: 'email',
    message: 'What\'s your email address?',
    field: 'email',
  },
  {
    id: 'phone',
    message: 'What\'s your phone number? (optional)',
    field: 'phone',
    optional: true,
  },
  {
    id: 'documents',
    message: 'Would you like to upload any supporting documents? (e.g., business license, ID)',
    isAction: true,
    actions: [
      { label: 'Yes, upload documents', value: 'yes' },
      { label: 'No, skip for now', value: 'no' },
    ],
  },
  {
    id: 'complete',
    message: 'Great! You can review your information and submit the form. Would you like me to submit it for you?',
    isAction: true,
    actions: [
      { label: 'Yes, submit now', value: 'submit' },
      { label: 'No, I\'ll review first', value: 'review' },
    ],
  },
];

// Helper function to extract field value from user input
const extractFieldValue = (input, fieldName) => {
  // This is a simple implementation - you might want to make it smarter
  // based on your specific requirements
  return input.trim();
};

const AIAssistant = () => {
  const {
    isOpen,
    messages,
    isTyping,
    currentStep,
    currentQuestion,
    handleUserResponse,
    handleUnexpectedInput,
    startOver,
    toggleChat,
    messagesEndRef,
    updateFormField,
    formValues,
    handleFileUploadComplete,
    addMessage
  } = useAIAssistant();
  
  const [inputValue, setInputValue] = useState('');
  const [showFileUpload, setShowFileUpload] = useState(false);
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle form submission
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const trimmedValue = inputValue.trim();
    if (!trimmedValue || isTyping) return;
    
    // Handle file upload step
    if (currentStep === 5) { // documents step
      setShowFileUpload(true);
      return;
    }
    
    // Handle confirmation step
    if (currentStep >= STEPS.length - 1) {
      if (trimmedValue.toLowerCase().includes('yes')) {
        handleUserResponse('yes');
      } else {
        handleUserResponse('no');
      }
      setInputValue('');
      return;
    }
    
    // Handle regular input
    handleUserResponse(trimmedValue);
    setInputValue('');
  }, [inputValue, isTyping, currentStep, handleUserResponse]);

  const handleActionClick = useCallback(async (action) => {
    try {
      if (action.field) {
        await updateFormField(action.field, action.value);
      }
      
      if (action.value === 'submit') {
        const result = await triggerSubmit();
        if (result.success) {
          addBotMessage('Great! Your registration has been submitted successfully!');
        } else {
          addBotMessage('There was an error submitting your registration. Please try again.');
        }
      } else {
        handleUserResponse(action.value);
      }
    } catch (error) {
      console.error('Error handling action:', error);
      addBotMessage('Sorry, there was an error processing your action. Please try again.');
    }
  }, [handleUserResponse, updateFormField, triggerSubmit, addBotMessage]);

  // Handle file upload
  const handleFileChange = useCallback((e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // Update form with files
      updateFormField('documents', files);
      // Hide file input
      setShowFileUpload(false);
      // Notify user
      addMessage(`Uploaded ${files.length} file(s)`, true);
      // Complete the file upload step
      handleFileUploadComplete();
    }
  }, [updateFormField, addMessage, handleFileUploadComplete]);
  
  // Auto-focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, currentStep]); // Re-run when step changes

  if (!isOpen) {
    return (
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 z-50 flex items-center justify-center"
        aria-label="Chat with AI Assistant"
      >
        <FiMessageSquare className="w-6 h-6" />
        <span className="sr-only">Chat with AI Assistant</span>
      </button>
    );
  }

  return (
    <div 
      className="fixed bottom-6 right-6 w-96 bg-white rounded-xl shadow-2xl flex flex-col z-50 overflow-hidden border border-gray-200 transform transition-all duration-300 ease-in-out"
      style={{ 
        maxHeight: '80vh',
        opacity: isOpen ? 1 : 0,
        transform: isOpen ? 'translateY(0)' : 'translateY(20px)',
        pointerEvents: isOpen ? 'auto' : 'none'
      }}
    >
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h3 className="font-semibold">Registration Assistant</h3>
        <div className="flex space-x-2">
          <button 
            onClick={startOver}
            className="p-1 rounded-full hover:bg-blue-500 transition-colors"
            aria-label="Start over"
          >
            <FiRotateCcw className="w-4 h-4" />
          </button>
          <button 
            onClick={toggleChat}
            className="p-1 rounded-full hover:bg-blue-500 transition-colors"
            aria-label="Close chat"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Messages */}
      <div 
        className="flex-1 p-4 overflow-y-auto bg-gray-50" 
        style={{ 
          maxHeight: '60vh',
          scrollBehavior: 'smooth'
        }}
      >
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={`${index}-${message.timestamp || Date.now()}`}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.isUser
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-white border border-gray-200 rounded-bl-none'
                } ${message.isUser ? 'animate-slide-in-right' : 'animate-slide-in-left'}`}
                style={{
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                }}
              >
                {message.text}
              </div>
            </div>
          ))}
          
          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          )}
          
          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-white relative">
        {isTyping && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center">
            <div className="flex space-x-1 mr-1">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <span>AI is typing...</span>
          </div>
        )}
        {currentQuestion && (
          <div className="text-sm text-gray-500 mb-2">
            {currentQuestion}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your response..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiSend className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIAssistant;
