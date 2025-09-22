import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertCircle, Eye, EyeOff, Info, X, CheckCircle } from 'lucide-react';

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
export function SmartForm() {
  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [fieldStatus, setFieldStatus] = useState<FieldStatus>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState<{ [key: string]: boolean }>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const validationTimeouts = useRef<{ [key: string]: NodeJS.Timeout }>({});

  // Form configuration
  const formFields: FormField[] = [
    {
      name: 'firstName',
      label: 'First Name',
      type: 'text',
      placeholder: 'Enter your first name',
      autoComplete: 'given-name',
      validation: {
        required: true,
        minLength: 2,
        maxLength: 50,
        pattern: /^[a-zA-Z\s'-]+$/,
        custom: (value) => {
          if (value && value.trim().length < 2) return 'First name must be at least 2 characters';
          if (value && !/^[a-zA-Z\s'-]+$/.test(value)) return 'First name can only contain letters, spaces, hyphens, and apostrophes';
          return null;
        }
      },
      helpText: 'Enter your legal first name as it appears on official documents'
    },
    {
      name: 'lastName',
      label: 'Last Name',
      type: 'text',
      placeholder: 'Enter your last name',
      autoComplete: 'family-name',
      validation: {
        required: true,
        minLength: 2,
        maxLength: 50,
        pattern: /^[a-zA-Z\s'-]+$/,
        custom: (value) => {
          if (value && value.trim().length < 2) return 'Last name must be at least 2 characters';
          if (value && !/^[a-zA-Z\s'-]+$/.test(value)) return 'Last name can only contain letters, spaces, hyphens, and apostrophes';
          return null;
        }
      }
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'Enter your email address',
      autoComplete: 'email',
      validation: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        custom: (value) => {
          if (!value) return 'Email address is required';
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
          if (value.length > 254) return 'Email address is too long';
          return null;
        }
      },
      helpText: 'We\'ll use this to send you important updates and confirmations'
    },
    {
      name: 'phone',
      label: 'Phone Number',
      type: 'tel',
      placeholder: '(555) 123-4567',
      autoComplete: 'tel',
      validation: {
        required: true,
        pattern: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
        custom: (value) => {
          if (!value) return 'Phone number is required';
          const cleaned = value.replace(/\D/g, '');
          if (cleaned.length !== 10) return 'Phone number must be 10 digits';
          if (!/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(value)) {
            return 'Please enter a valid phone number (e.g., (555) 123-4567)';
          }
          return null;
        }
      },
      helpText: 'Include area code for faster service'
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Create a secure password',
      autoComplete: 'new-password',
      validation: {
        required: true,
        minLength: 8,
        custom: (value) => {
          if (!value) return 'Password is required';
          if (value.length < 8) return 'Password must be at least 8 characters long';
          if (!/(?=.*[a-z])/.test(value)) return 'Password must contain at least one lowercase letter';
          if (!/(?=.*[A-Z])/.test(value)) return 'Password must contain at least one uppercase letter';
          if (!/(?=.*\d)/.test(value)) return 'Password must contain at least one number';
          if (!/(?=.*[@$!%*?&])/.test(value)) return 'Password must contain at least one special character (@$!%*?&)';
          return null;
        }
      },
      helpText: 'Must be 8+ characters with uppercase, lowercase, number, and special character'
    },
    {
      name: 'confirmPassword',
      label: 'Confirm Password',
      type: 'password',
      placeholder: 'Confirm your password',
      autoComplete: 'new-password',
      validation: {
        required: true,
        dependencies: ['password'],
        custom: (value) => {
          if (!value) return 'Please confirm your password';
          return null;
        }
      }
    },
    {
      name: 'company',
      label: 'Company',
      type: 'text',
      placeholder: 'Enter your company name (optional)',
      autoComplete: 'organization',
      validation: {
        maxLength: 100
      }
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
        { value: 'website', label: 'New Website' },
        { value: 'redesign', label: 'Website Redesign' },
        { value: 'ecommerce', label: 'E-commerce Store' },
        { value: 'webapp', label: 'Web Application' },
        { value: 'mobile', label: 'Mobile App' },
        { value: 'other', label: 'Other' }
      ],
      helpText: 'This helps us understand your needs better'
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

  // Real-time validation with debouncing
  const handleFieldChange = (fieldName: string, value: string) => {
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
  const handleFieldBlur = (fieldName: string) => {
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
  const formatPhoneNumber = (value: string) => {
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

  // Handle input change with formatting
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    let formattedValue = value;
    if (name === 'phone') {
      formattedValue = formatPhoneNumber(value);
    }
    
    handleFieldChange(name, formattedValue);
  };

  // Password strength indicator
  const getPasswordStrength = (password: string) => {
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
  const handleSubmit = async (e: React.FormEvent) => {
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
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Form submitted:', formData);
      setSubmitSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setFormData({});
        setErrors({});
        setFieldStatus({});
        setTouchedFields(new Set());
        setSubmitSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      Object.values(validationTimeouts.current).forEach(timeout => {
        clearTimeout(timeout);
      });
    };
  }, []);

  // Success state
  if (submitSuccess) {
    return (
      <motion.div
        className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <motion.div
            className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <CheckCircle className="w-8 h-8 text-green-600" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Success!</h2>
          <p className="text-gray-600 mb-6">
            Your form has been submitted successfully. We'll get back to you within 24 hours.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-2">What happens next?</h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• You'll receive a confirmation email shortly</li>
              <li>• Our team will review your project details</li>
              <li>• We'll schedule a consultation call within 24 hours</li>
            </ul>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Get Started</h2>
        <p className="text-gray-600">
          Tell us about your project and we'll get back to you with a custom proposal.
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
                className="block text-sm font-medium text-gray-700"
              >
                {field.label}
                {field.validation.required && (
                  <span className="text-red-500 ml-1">*</span>
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
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 resize-y ${
                      showError
                        ? 'border-red-500 focus:ring-red-500/20 bg-red-50'
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
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                      showError
                        ? 'border-red-500 focus:ring-red-500/20 bg-red-50'
                        : showSuccess
                        ? 'border-green-500 focus:ring-green-500/20 bg-green-50'
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/20'
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
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                      field.type === 'password' ? 'pr-12' : ''
                    } ${
                      showError
                        ? 'border-red-500 focus:ring-red-500/20 bg-red-50'
                        : showSuccess
                        ? 'border-green-500 focus:ring-green-500/20 bg-green-50'
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/20'
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
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
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
                  {fieldValue.length}/{field.validation.maxLength}
                </div>
              )}

              {/* Error message */}
              <AnimatePresence>
                {showError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-start space-x-2 text-red-600 text-sm"
                  >
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{fieldError}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Help text */}
              {field.helpText && !showError && (
                <div className="flex items-start space-x-2 text-gray-500 text-sm">
                  <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{field.helpText}</span>
                </div>
              )}
            </div>
          );
        })}

        {/* Submit button */}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:bg-blue-700 shadow-lg hover:shadow-xl'
          } text-white focus:outline-none focus:ring-4 focus:ring-blue-500/30`}
          whileHover={!isSubmitting ? { scale: 1.02 } : {}}
          whileTap={!isSubmitting ? { scale: 0.98 } : {}}
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
          ) : (
            'Submit Project Request'
          )}
        </motion.button>

        {/* Form footer */}
        <div className="text-center text-sm text-gray-500">
          <p>
            By submitting this form, you agree to our{' '}
            <a href="#" className="text-blue-600 hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>
          </p>
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