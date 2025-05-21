import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { FiUpload, FiLoader, FiCheckCircle, FiAlertCircle, FiMessageSquare } from 'react-icons/fi';
import { useAIAssistant } from '../context/AIAssistantContext';

const RegisterForm = () => {
  const { handleUserResponse } = useAIAssistant();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({
    success: null,
    message: ''
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    reset, 
    setValue, 
    watch, 
    getValues 
  } = useForm();
  
  // Watch all form fields
  const formValues = watch();
  
  // Sync form values with AI assistant context
  useEffect(() => {
    // This effect will run whenever form values change
    // You can use this to sync with AI assistant if needed
  }, [formValues]);
  
  // Register form submission with AI assistant
  const {
    setSubmitForm,
    updateFormField,
    handleFileUploadComplete
  } = useAIAssistant();
  
  const updateFormFieldRef = useRef(updateFormField);
  
  // Create a form submission handler that can be called by the AI assistant
  const handleFormSubmit = useCallback(async () => {
    try {
      const formData = getValues();
      const formDataObj = new FormData();
      
      // Add form data to FormData object
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formDataObj.append(key, value);
        }
      });
      
      // Add files if any
      if (selectedFiles.length > 0) {
        selectedFiles.forEach((file) => {
          formDataObj.append('files', file);
        });
      }
      
      // Submit the form
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/register`,
        formDataObj,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Form submission error:', error);
      throw error;
    }
  }, [getValues, selectedFiles]);
  
  // Register the form submission handler with the AI assistant
  useEffect(() => {
    setSubmitForm(() => handleFormSubmit);
    
    // Initial form values
    const initialValues = {
      companyName: '',
      areaOfService: '',
      fullName: '',
      email: '',
      phone: '',
      documents: []
    };
    
    // Set initial form values
    Object.entries(initialValues).forEach(([key, value]) => {
      setValue(key, value);
    });
    
    return () => {
      // Clean up when component unmounts
      setSubmitForm(null);
    };
  }, [handleFormSubmit, setSubmitForm, setValue]);
  
  // Handle field updates from AI assistant
  useEffect(() => {
    const handleAIFieldUpdate = (field, value) => {
      if (value !== undefined && value !== null) {
        setValue(field, value, { shouldValidate: true });
      }
    };
    
    // Set up the field update handler in the AI assistant context
    const updateFormField = async (field, value) => {
      try {
        // Handle file uploads separately
        if (field === 'documents' && Array.isArray(value)) {
          setSelectedFiles(value);
          return Promise.resolve();
        }
        
        // Update the form field
        setValue(field, value, { shouldValidate: true });
        return Promise.resolve();
      } catch (error) {
        console.error('Error updating form field:', error);
        return Promise.reject(error);
      }
    };
    
        // Register the update function with the AI assistant
    if (updateFormField) {
      updateFormFieldRef.current = updateFormField;
    } else {
      updateFormFieldRef.current = async (field, value) => {
        setValue(field, value, { shouldValidate: true });
        return Promise.resolve();
      };
    }
    
    // Clean up on unmount
    return () => {
      updateFormFieldRef.current = null;
    };
  }, [setValue]);
  
  // Handle file selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    // Update form value for validation
    setValue('documents', files, { shouldValidate: true });
    
    // Notify the AI assistant that files were uploaded
    if (handleFileUploadComplete) {
      handleFileUploadComplete();
    }
  };

  // Handle form submission
  const onSubmit = useCallback(async (data) => {
    setIsSubmitting(true);
    setSubmitStatus({ success: null, message: '' });
    
    try {
      const formData = new FormData();
      
      // Add company and applicant data
      formData.append('company_name', data.companyName);
      formData.append('area_of_service', data.areaOfService || '');
      formData.append('applicant[full_name]', data.fullName);
      formData.append('applicant[email]', data.email);
      formData.append('applicant[phone]', data.phone || '');
      
      // Add files if any
      if (selectedFiles.length > 0) {
        selectedFiles.forEach((file) => {
          formData.append('files', file);
        });
      }
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/register`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      const result = {
        success: true,
        message: 'Registration successful! Your company has been registered.',
        data: response.data
      };
      
      setSubmitStatus(result);
      
      // Reset form
      reset();
      setSelectedFiles([]);
      
      return result;
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.detail || 'An error occurred during registration. Please try again.';
      const result = {
        success: false,
        message: errorMessage,
        error: error
      };
      setSubmitStatus(result);
      throw result; // Re-throw to be caught by the AI assistant
    } finally {
      setIsSubmitting(false);
    }
  }, [reset, selectedFiles]);
  
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md relative">
      <div className="absolute -right-4 -top-4">
        <button
          onClick={() => handleUserResponse('help')}
          className="bg-blue-100 text-blue-600 p-2 rounded-full hover:bg-blue-200 transition-colors"
          title="Get help filling the form"
          type="button"
        >
          <FiMessageSquare className="w-5 h-5" />
        </button>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Company Registration</h2>
      
      {submitStatus.success !== null && (
        <div 
          className={`mb-6 p-4 rounded-md ${
            submitStatus.success 
              ? 'bg-green-100 text-green-700 border border-green-200' 
              : 'bg-red-100 text-red-700 border border-red-200'
          }`}
        >
          <div className="flex items-center">
            {submitStatus.success ? (
              <FiCheckCircle className="mr-2" />
            ) : (
              <FiAlertCircle className="mr-2" />
            )}
            <span>{submitStatus.message}</span>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Company Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Company Information</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                Company Name *
              </label>
              <input
                type="text"
                id="companyName"
                {...register('companyName', { required: 'Company name is required' })}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                  errors.companyName ? 'border-red-300' : 'border'
                }`}
                disabled={isSubmitting}
              />
              {errors.companyName && (
                <p className="mt-1 text-sm text-red-600">{errors.companyName.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="areaOfService" className="block text-sm font-medium text-gray-700">
                Area of Service
              </label>
              <input
                type="text"
                id="areaOfService"
                {...register('areaOfService')}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>
        
        {/* Applicant Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Applicant Information</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Full Name *
              </label>
              <input
                type="text"
                id="fullName"
                {...register('fullName', { required: 'Full name is required' })}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                  errors.fullName ? 'border-red-300' : 'border'
                }`}
                disabled={isSubmitting}
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email *
              </label>
              <input
                type="email"
                id="email"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                  errors.email ? 'border-red-300' : 'border'
                }`}
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                {...register('phone')}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>
        
        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Documents (Optional)
          </label>
          <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <div className="flex text-sm text-gray-600 justify-center">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                >
                  <span>Upload files</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    multiple
                    onChange={handleFileChange}
                    disabled={isSubmitting}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">
                PDF, DOC, DOCX, JPG, PNG up to 10MB
              </p>
              {selectedFiles.length > 0 && (
                <div className="mt-2 text-sm text-gray-600">
                  <p>Selected files: {selectedFiles.length}</p>
                  <ul className="mt-1 text-xs text-gray-500">
                    {selectedFiles.map((file, index) => (
                      <li key={index} className="truncate">
                        {file.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <>
                <FiLoader className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                Submitting...
              </>
            ) : (
              'Register Company'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
