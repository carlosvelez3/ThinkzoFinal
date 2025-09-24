import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertCircle, Eye, EyeOff, Info, X, CheckCircle, Clock, DollarSign, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import { RetryButton } from '../RetryButton';
import { AnimatedI } from '../AnimatedI';

// Types for form validation
interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
  dependencies?: string[];
}

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'tel' | 'textarea' | 'select';
  placeholder?: string;
  validation: ValidationRule;
  options?: { value: string; label: string }[];
  helpText?: string;
  autoComplete?: string;
}

interface ProjectType {
  id: string;
  name: string;
  icon: string;
  timeline: string;
  budget: string;
}

interface SmartFormProps {
  formFields?: FormField[];
  onSuccess?: (data: FormData) => void;
  onSubmit?: (data: FormData) => Promise<void>;
  executeRecaptcha?: (action: string) => Promise<string | null>;
  recaptchaReady?: boolean;
  recaptchaError?: string | null;
  title?: string;
  description?: string;
  submitButtonText?: string;
  projectTypes?: ProjectType[];
  showProgressSteps?: boolean;
}

interface FormData {
  [key: string]: string;
}

interface FormErrors {
  [key: string]: string;
}

interface FieldStatus {
  [key: string]: 'idle' | 'validating' | 'valid' | 'invalid';
}

// Smart Form Component with Advanced Validation
export function SmartForm({
  formFields: customFormFields,
  onSuccess,
  onSubmit,
  executeRecaptcha,
  recaptchaReady = true,
  recaptchaError,
  title = "Get Started",
  description = "Tell us about your project and we'll get back to you with a custom proposal.",
  submitButtonText = "Submit Project Request",
  projectTypes,
  showProgressSteps = false
}: SmartFormProps) {
  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [fieldStatus, setFieldStatus] = useState<FieldStatus>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState<{ [key: string]: boolean }>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const [submitError, setSubmitError] = useState<string | null>(null);
  const validationTimeouts = useRef<{ [key: string]: NodeJS.Timeout }>({});

  const { handleAsyncError } = useErrorHandler();

  // Default form configuration (can be overridden by props)
  const defaultFormFields: FormField[] = [
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'your@email.com',
      autoComplete: 'email',
      validation: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        custom: (value) => {
          if (!value) return 'Email is required to send you project updates';
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
          if (value.length > 254) return 'Email address is too long';
          return null;
        }
      },
      helpText: 'We\'ll use this to send you important updates and confirmations'
    },
    {
      name: 'projectType',
      label: 'Project Type',
      type: 'select',
      validation: {
        required: true
      },
      options: [
        { value: '', label: 'Select project type' },
        { value: 'landing-page', label: 'Landing Page' },
        { value: 'business-website', label: 'Business Website' },
        { value: 'ecommerce', label: 'E-commerce Store' },
        { value: 'web-app', label: 'Web Application' },
        { value: 'ai-integration', label: 'AI Integration' },
        { value: 'other', label: 'Other/Custom' }
      ],
      helpText: 'This helps us understand your needs better'
    },
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      placeholder: 'Your name',
      autoComplete: 'name',
      validation: {
        required: true,
        minLength: 2,
        maxLength: 100,
        pattern: /^[a-zA-Z\s'-]+$/,
        custom: (value) => {
          if (value && value.trim().length < 2) return 'Name must be at least 2 characters';
          if (value && !/^[a-zA-Z\s'-]+$/.test(value)) return 'Name can only contain letters, spaces, hyphens, and apostrophes';
          return null;
        }
      },
      helpText: 'We\'d love to know what to call you'
    },
    {
      name: 'phone',
      label: 'Phone (optional)',
      type: 'tel',
      placeholder: '(555) 123-4567',
      autoComplete: 'tel',
      validation: {
        custom: (value) => {
          if (value && value.trim()) {
            const cleaned = value.replace(/\D/g, '');
            if (cleaned.length !== 10) return 'Phone number must be 10 digits';
            if (!/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(value)) {
              return 'Please enter a valid phone number (e.g., (555) 123-4567)';
            }
          }
          return null;
        }
      }
    },
    {
      name: 'company',
      label: 'Company (optional)',
      type: 'text',
      placeholder: 'Your company name',
      autoComplete: 'organization',
      validation: {
        maxLength: 100
      }
    },
    {
      name: 'message',
      label: 'Project Details',
      type: 'textarea',
      placeholder: 'Tell us about your project goals, timeline, and any specific requirements...',
      validation: {
        required: true,
        minLength: 20,
        maxLength: 1000,
        custom: (value) => {
          if (!value) return 'Please describe your project';
          if (value.length < 20) return 'Please provide more details (at least 20 characters)';
          if (value.length > 1000) return 'Message is too long (maximum 1000 characters)';
          return null;
        }
      },
      helpText: 'The more details you provide, the better we can help you'
    }
  ];

  // Use custom form fields or default ones
  const formFields = customFormFields || defaultFormFields;

  // Default project types for contact form
  const defaultProjectTypes: ProjectType[] = [
    { id: 'landing-page', name: 'Landing Page', icon: '🎯', timeline: '1-2 weeks', budget: '$495' },
    { id: 'business-website', name: 'Business Website', icon: '🏢', timeline: '2-4 weeks', budget: '$800-$1,500' },
    { id: 'ecommerce', name: 'E-commerce Store', icon: '🛒', timeline: '4-8 weeks', budget: '$1,500-$3,500' },
    { id: 'web-app', name: 'Web Application', icon: '⚡', timeline: '6-12 weeks', budget: '$3,500+' },
    { id: 'ai-integration', name: 'AI Integration', icon: '🤖', timeline: '4-10 weeks', budget: '$2,000+' },
    { id: 'other', name: 'Other/Custom', icon: '💡', timeline: 'Varies', budget: 'Custom Quote' }
  ];

  const activeProjectTypes = projectTypes || defaultProjectTypes;

  // Validation function
  const validateField = (fieldName: string, value: string, allData: FormData = formData): string | null => {
    const field = formFields.find(f => f.name === fieldName);
    if (!field) return null;

    const { validation } = field;

    // Required validation
    if (validation.required && (!value || value.trim() === '')) {
      return `${field.label} is required`;
    }

    // Skip other validations if field is empty and not required
    if (!value || value.trim() === '') return null;

    // Length validations
    if (validation.minLength && value.length < validation.minLength) {
      return `${field.label} must be at least ${validation.minLength} characters`;
    }

    if (validation.maxLength && value.length > validation.maxLength) {
      return `${field.label} must be no more than ${validation.maxLength} characters`;
    }

    // Pattern validation
    if (validation.pattern && !validation.pattern.test(value)) {
      return `Please enter a valid ${field.label.toLowerCase()}`;
    }

    // Dependency validation (e.g., confirm password)
    if (validation.dependencies) {
      for (const dep of validation.dependencies) {
        if (fieldName === 'confirmPassword' && dep === 'password') {
          if (value !== allData.password) {
            return 'Passwords do not match';
          }
        }
      }
    }

    // Custom validation
    if (validation.custom) {
      const customError = validation.custom(value);
      if (customError) return customError;
    }

    return null;
  };

  // Check if we can proceed to next step

  // Real-time validation with debouncing
  const handleFieldChange = (fieldName: string, value: string): void => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    
    // Clear existing timeout
    if (validationTimeouts.current[fieldName]) {
      clearTimeout(validationTimeouts.current[fieldName]);
    }

    // Set field status to validating
    setFieldStatus(prev => ({ ...prev, [fieldName]: 'validating' }));

    // Debounced validation
    validationTimeouts.current[fieldName] = setTimeout(() => {
      const error = validateField(fieldName, value);
      setErrors(prev => ({ ...prev, [fieldName]: error || '' }));
      setFieldStatus(prev => ({ 
        ...prev, 
        [fieldName]: error ? 'invalid' : 'valid' 
      }));

      // Re-validate dependent fields
      const field = formFields.find(f => f.name === fieldName);
      if (field && fieldName === 'password') {
        const confirmPasswordValue = formData.confirmPassword;
        if (confirmPasswordValue) {
          const confirmError = validateField('confirmPassword', confirmPasswordValue, { ...formData, [fieldName]: value });
          setErrors(prev => ({ ...prev, confirmPassword: confirmError || '' }));
          setFieldStatus(prev => ({ 
            ...prev, 
            confirmPassword: confirmError ? 'invalid' : 'valid' 
          }));
        }
      }
    }, 300);
  };

  // Handle field blur
  const handleFieldBlur = (fieldName: string): void => {
    setTouchedFields(prev => new Set([...prev, fieldName]));
    const value = formData[fieldName] || '';
    const error = validateField(fieldName, value);
    setErrors(prev => ({ ...prev, [fieldName]: error || '' }));
    setFieldStatus(prev => ({ 
      ...prev, 
      [fieldName]: error ? 'invalid' : 'valid' 
    }));
  };

  // Format phone number as user types
  const formatPhoneNumber = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (match) {
      let formatted = '';
      if (match[1]) formatted += `(${match[1]}`;
      if (match[1] && match[1].length === 3) formatted += ') ';
      if (match[2]) formatted += match[2];
      if (match[2] && match[2].length === 3) formatted += '-';
      if (match[3]) formatted += match[3];
      return formatted;
    }
    return value;
  };

  // Handle project type selection for card-based UI
  const handleProjectTypeSelect = (projectTypeId: string): void => {
    handleFieldChange('projectType', projectTypeId);
  };

  // Handle input change with formatting
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    
    let formattedValue = value;
    if (name === 'phone') {
      formattedValue = formatPhoneNumber(value);
    }
    
    handleFieldChange(name, formattedValue);
  };

  // Password strength indicator
  const getPasswordStrength = (password: string): { level: string; color: string; percentage: number } => {
    let strength = 0;
    const checks = [
      password.length >= 8,
      /[a-z]/.test(password),
      /[A-Z]/.test(password),
      /\d/.test(password),
      /[@$!%*?&]/.test(password)
    ];
    
    strength = checks.filter(Boolean).length;
    
    const levels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
    
    return {
      level: levels[strength - 1] || 'Very Weak',
      color: colors[strength - 1] || 'bg-red-500',
      percentage: (strength / 5) * 100
    };
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allFieldNames = formFields.map(f => f.name);
    setTouchedFields(new Set(allFieldNames));
    
    // Validate all fields
    const newErrors: FormErrors = {};
    let hasErrors = false;
    
    for (const field of formFields) {
      const error = validateField(field.name, formData[field.name] || '');
      if (error) {
        newErrors[field.name] = error;
        hasErrors = true;
      }
    }
    
    setErrors(newErrors);
    
    if (hasErrors) {
      // Focus first error field
      const firstErrorField = formFields.find(f => newErrors[f.name]);
      if (firstErrorField) {
        const element = document.getElementById(firstErrorField.name);
        element?.focus();
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    setIsSubmitting(true);
    
    const result = await handleAsyncError(async () => {
      // Get reCAPTCHA token if available
      let recaptchaToken: string | null = null;
      if (executeRecaptcha) {
        recaptchaToken = await executeRecaptcha('contact_form_submit');
        if (!recaptchaToken) {
          throw new Error('reCAPTCHA verification failed. Please try again.');
        }
      }

      // Add reCAPTCHA token to form data
      const submissionData = { ...formData };
      if (recaptchaToken) {
        submissionData.recaptchaToken = recaptchaToken;
      }

      if (onSubmit) {
        await onSubmit(submissionData);
      } else {
        await submitFormData();
      }
      
      setSubmitSuccess(true);
      setSubmitError(null);
      
      // Call success callback
      if (onSuccess) {
        onSuccess(submissionData);
      }
    }, { formData, action: 'smart_form_submit' });
    
    if (!result) {
      setSubmitError('Failed to submit form. Please try again.');
    }
    
    setIsSubmitting(false);
  };

  const handleRetrySubmit = async (): Promise<void> => {
    setSubmitError(null);
    await handleSubmit({ preventDefault: () => {} } as React.FormEvent);
  };

  const submitFormData = async (): Promise<void> => {
    // Default submission logic (can be overridden by onSubmit prop)
    // eslint-disable-next-line no-console
    console.log('Form submitted:', formData);
    
    // Simulate API call
    // Simulate API call with potential failure
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate random failures for demo
    if (Math.random() < 0.3) {
      throw new Error('Network error: Failed to submit form');
    }
  };

  // Cleanup timeouts
  useEffect(() => {
    return (): void => {
      Object.values(validationTimeouts.current).forEach(timeout => {
        if (timeout) clearTimeout(timeout);
      });
    };
  }, []);

  // Success state
  if (submitSuccess) {
    return (
      <motion.div 
        className="text-center py-8"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-4 font-montserrat">
          Thank You{formData.name ? `, ${formData.name}` : ''}!
        </h3>
        <p className="text-gray-300 mb-6 font-poppins">
          We've received your project inquiry. We'll review your requirements and get back to you within 24 hours.
        </p>
        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="text-white font-semibold mb-2">What's Next?</h4>
          <ul className="text-sm text-gray-300 space-y-1 text-left">
            <li>• We'll review your project details</li>
            <li>• Schedule a discovery call within 24 hours</li>
            <li>• Provide a detailed proposal and timeline</li>
          </ul>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-4 font-montserrat">
          {title}
        </h3>
        <p className="text-gray-300 font-poppins">
          {description}
        </p>
      </div>


      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {formFields.map((field) => {
          const fieldValue = formData[field.name] || '';
          const fieldError = errors[field.name];
          const isFieldTouched = touchedFields.has(field.name);
          const status = fieldStatus[field.name] || 'idle';
          const showError = fieldError && (isFieldTouched || status === 'invalid');
          const showSuccess = !fieldError && fieldValue && status === 'valid';


          return (
            <div key={field.name} className="space-y-2">
              <label
                htmlFor={field.name}
                className="block text-sm font-bold text-white mb-2 font-poppins"
              >
                {field.label}
                {field.validation.required && (
                  <span className="text-primary-accent ml-1">*</span>
                )}
              </label>

              <div className="relative">
                {field.type === 'textarea' ? (
                  <textarea
                    id={field.name}
                    name={field.name}
                    value={fieldValue}
                    onChange={handleInputChange}
                    onBlur={() => handleFieldBlur(field.name)}
                    placeholder={field.placeholder}
                    rows={4}
                    className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 resize-y ${
                      showError
                        ? 'border-red-500 focus:ring-red-500/20'
                        : showSuccess
                        ? 'border-green-500 focus:ring-green-500/20 bg-green-50'
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/20'
                    }`}
                  />
                ) : field.type === 'select' ? (
                  <select
                    id={field.name}
                    name={field.name}
                    value={fieldValue}
                    onChange={handleInputChange}
                    onBlur={() => handleFieldBlur(field.name)}
                    className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white focus:outline-none focus:ring-2 transition-all duration-200 ${
                      showError
                        ? 'border-red-500 focus:ring-red-500/20'
                        : showSuccess
                        ? 'border-green-500 focus:ring-green-500/20'
                        : 'border-gray-600 focus:border-primary-accent focus:ring-primary-accent/20'
                    }`}
                  >
                    {field.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type === 'password' && showPassword[field.name] ? 'text' : field.type}
                    value={fieldValue}
                    onChange={handleInputChange}
                    onBlur={() => handleFieldBlur(field.name)}
                    placeholder={field.placeholder}
                    autoComplete={field.autoComplete}
                    className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                      field.type === 'password' ? 'pr-12' : ''
                    } ${
                      showError
                        ? 'border-red-500 focus:ring-red-500/20'
                        : showSuccess
                        ? 'border-green-500 focus:ring-green-500/20'
                        : 'border-gray-600 focus:border-primary-accent focus:ring-primary-accent/20'
                    }`}
                  />
                )}

                {/* Password visibility toggle */}
                {field.type === 'password' && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => ({ 
                      ...prev, 
                      [field.name]: !prev[field.name] 
                    }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
                  >
                    {showPassword[field.name] ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                )}

                {/* Field status icons */}
                {status === 'validating' && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"
                    />
                  </div>
                )}

                {showSuccess && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <Check className="w-5 h-5 text-green-500" />
                  </motion.div>
                )}

                {showError && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  </motion.div>
                )}
              </div>

              {/* Password strength indicator */}
              {field.name === 'password' && fieldValue && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Password strength:</span>
                    <span className={`font-medium ${
                      getPasswordStrength(fieldValue).level === 'Strong' ? 'text-green-600' :
                      getPasswordStrength(fieldValue).level === 'Good' ? 'text-blue-600' :
                      getPasswordStrength(fieldValue).level === 'Fair' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {getPasswordStrength(fieldValue).level}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      className={`h-2 rounded-full ${getPasswordStrength(fieldValue).color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${getPasswordStrength(fieldValue).percentage}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              )}

              {/* Character count for textarea */}
              {field.type === 'textarea' && field.validation.maxLength && (
                <div className="text-right text-sm text-gray-500">
                  <span className={fieldValue.length > (field.validation.maxLength * 0.9) ? 'text-orange-400' : 'text-gray-400'}>
                    {fieldValue.length}
                  </span>
                  /{field.validation.maxLength}
                </div>
              )}

              {/* Error message */}
              <AnimatePresence>
                {showError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-start space-x-2 text-red-400 text-sm"
                  >
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{fieldError}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Help text */}
              {field.helpText && !showError && (
                <div className="flex items-start space-x-2 text-gray-400 text-sm">
                  <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{field.helpText}</span>
                </div>
              )}
            </div>
          );
        })}

        {/* reCAPTCHA Status */}
        {recaptchaError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3"
          >
            <AlertCircle className="w-4 h-4 mr-2" />
            <span>Security verification unavailable. Please refresh the page.</span>
          </motion.div>
        )}
        
        {recaptchaReady && !recaptchaError && executeRecaptcha && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center text-green-400 text-sm bg-green-500/10 border border-green-500/20 rounded-lg p-3"
          >
            <Check className="w-4 h-4 mr-2" />
            <span>🛡️ Protected by reCAPTCHA v3 - No interaction required</span>
          </motion.div>
        )}

        {/* Submit button */}
        <motion.button
          type="submit"
          disabled={isSubmitting || (executeRecaptcha && !recaptchaReady)}
          className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 ${
            isSubmitting || (executeRecaptcha && !recaptchaReady)
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-cta-yellow to-cta-yellow-hover hover:from-amber-600 hover:to-orange-600 focus:from-amber-600 focus:to-orange-600 text-white hover:scale-105 focus:scale-105 shadow-lg hover:shadow-xl focus:shadow-xl'
          } focus:outline-none focus:ring-4 focus:ring-amber-500/30`}
          whileHover={!isSubmitting && (!executeRecaptcha || recaptchaReady) ? { scale: 1.02 } : {}}
          whileTap={!isSubmitting && (!executeRecaptcha || recaptchaReady) ? { scale: 0.98 } : {}}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center space-x-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
              <span>Submitting...</span>
            </div>
          ) : executeRecaptcha && !recaptchaReady ? (
            'Loading security verification...'
          ) : executeRecaptcha && recaptchaError ? (
            'Security verification failed - Please refresh'
          ) : (
            <div className="flex items-center justify-center">
              <Zap className="w-5 h-5 mr-2" />
              {submitButtonText}
            </div>
          )}
        </motion.button>
        
        {/* Error state with retry */}
        {submitError && (
          <motion.div
            className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-700 text-sm mb-3">{submitError}</p>
                <RetryButton
                  onRetry={handleRetrySubmit}
                  className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1"
                >
                  Try Again
                </RetryButton>
              </div>
            </div>
          </motion.div>
        )}

        <div className="text-center space-y-2">
          <p>
            {!recaptchaReady && executeRecaptcha
              ? "Initializing security verification..."
              : "We'll respond within 24 hours with next steps"
            }
          </p>
          {executeRecaptcha && (
            <p className="text-xs text-gray-500 text-center">
              This site is protected by reCAPTCHA v3 for enhanced security without interruption.
            </p>
          )}
        </div>
      </form>
    </div>
  );
}

// Example usage component
export function FormValidationExample() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Smart Form Validation Demo
          </h1>
          <p className="text-xl text-gray-600">
            Experience user-friendly form validation with real-time feedback
          </p>
        </div>
        
        <SmartForm />
        
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Key Features Demonstrated
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Real-time Validation</h3>
                  <p className="text-gray-600 text-sm">
                    Immediate feedback as users type, with debounced validation to prevent excessive API calls
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Smart Error Prevention</h3>
                  <p className="text-gray-600 text-sm">
                    Input formatting (phone numbers), character limits, and pattern matching
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Visual Status Indicators</h3>
                  <p className="text-gray-600 text-sm">
                    Loading spinners, success checkmarks, and error icons provide clear feedback
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Helpful Error Messages</h3>
                  <p className="text-gray-600 text-sm">
                    Clear, actionable error messages that tell users exactly what to fix
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Password Strength Meter</h3>
                  <p className="text-gray-600 text-sm">
                    Visual password strength indicator with specific requirements
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Contextual Help</h3>
                  <p className="text-gray-600 text-sm">
                    Helpful hints and examples to guide users through complex fields
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Smooth Animations</h3>
                  <p className="text-gray-600 text-sm">
                    Subtle animations for state changes that don't distract from the task
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Success Confirmation</h3>
                  <p className="text-gray-600 text-sm">
                    Clear success state with next steps to reduce user anxiety
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}