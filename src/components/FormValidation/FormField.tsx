import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertCircle, Eye, EyeOff, Info } from 'lucide-react';
import { ValidationRule, validateField, FormatUtils, calculatePasswordStrength } from './ValidationUtils';

interface FormFieldProps {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'tel' | 'textarea' | 'select' | 'url';
  value: string;
  onChange: (name: string, value: string) => void;
  onBlur: (name: string) => void;
  validation: ValidationRule;
  error?: string;
  status?: 'idle' | 'validating' | 'valid' | 'invalid';
  touched?: boolean;
  placeholder?: string;
  helpText?: string;
  autoComplete?: string;
  options?: { value: string; label: string }[];
  rows?: number;
  disabled?: boolean;
  className?: string;
}

export function FormField({
  name,
  label,
  type,
  value,
  onChange,
  onBlur,
  validation,
  error,
  status = 'idle',
  touched = false,
  placeholder,
  helpText,
  autoComplete,
  options,
  rows = 4,
  disabled = false,
  className = ''
}: FormFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  const showError = error && (touched || status === 'invalid');
  const showSuccess = !error && value && status === 'valid' && touched;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    let formattedValue = e.target.value;
    
    // Apply formatting based on field type
    if (type === 'tel') {
      formattedValue = FormatUtils.formatPhoneNumber(formattedValue);
    }
    
    onChange(name, formattedValue);
  };

  const handleBlur = () => {
    setFocused(false);
    onBlur(name);
  };

  const handleFocus = () => {
    setFocused(true);
  };

  // Get field styling based on state
  const getFieldClasses = () => {
    const baseClasses = `w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
      type === 'password' ? 'pr-12' : ''
    } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`;

    if (showError) {
      return `${baseClasses} border-red-500 focus:ring-red-500/20 bg-red-50`;
    }
    if (showSuccess) {
      return `${baseClasses} border-green-500 focus:ring-green-500/20 bg-green-50`;
    }
    if (focused) {
      return `${baseClasses} border-blue-500 focus:ring-blue-500/20`;
    }
    return `${baseClasses} border-gray-300 focus:border-blue-500 focus:ring-blue-500/20`;
  };

  // Password strength for password fields
  const passwordStrength = type === 'password' && value ? calculatePasswordStrength(value) : null;

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label */}
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {validation.required && (
          <span className="text-red-500 ml-1" aria-label="required">*</span>
        )}
      </label>

      {/* Input Container */}
      <div className="relative">
        {/* Textarea */}
        {type === 'textarea' && (
          <textarea
            id={name}
            name={name}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            placeholder={placeholder}
            rows={rows}
            disabled={disabled}
            className={`${getFieldClasses()} resize-y`}
            aria-invalid={showError}
            aria-describedby={[
              showError ? `${name}-error` : null,
              helpText ? `${name}-help` : null
            ].filter(Boolean).join(' ') || undefined}
          />
        )}

        {/* Select */}
        {type === 'select' && (
          <select
            id={name}
            name={name}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            disabled={disabled}
            className={getFieldClasses()}
            aria-invalid={showError}
            aria-describedby={[
              showError ? `${name}-error` : null,
              helpText ? `${name}-help` : null
            ].filter(Boolean).join(' ') || undefined}
          >
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}

        {/* Input */}
        {type !== 'textarea' && type !== 'select' && (
          <input
            id={name}
            name={name}
            type={type === 'password' && showPassword ? 'text' : type}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            placeholder={placeholder}
            autoComplete={autoComplete}
            disabled={disabled}
            className={getFieldClasses()}
            aria-invalid={showError}
            aria-describedby={[
              showError ? `${name}-error` : null,
              helpText ? `${name}-help` : null
            ].filter(Boolean).join(' ') || undefined}
          />
        )}

        {/* Password visibility toggle */}
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}

        {/* Status icons */}
        {type !== 'password' && (
          <>
            {status === 'validating' && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"
                  aria-label="Validating"
                />
              </div>
            )}

            {showSuccess && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <Check className="w-5 h-5 text-green-500" aria-label="Valid" />
              </motion.div>
            )}

            {showError && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <AlertCircle className="w-5 h-5 text-red-500" aria-label="Invalid" />
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Password strength indicator */}
      {type === 'password' && value && passwordStrength && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-2"
        >
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Password strength:</span>
            <span className={`font-medium ${
              passwordStrength.level === 'Strong' ? 'text-green-600' :
              passwordStrength.level === 'Good' ? 'text-blue-600' :
              passwordStrength.level === 'Fair' ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {passwordStrength.level}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className={`h-2 rounded-full ${passwordStrength.color}`}
              initial={{ width: 0 }}
              animate={{ width: `${passwordStrength.percentage}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      )}

      {/* Character count for textarea */}
      {type === 'textarea' && validation.maxLength && (
        <div className="text-right text-sm text-gray-500">
          <span className={value.length > validation.maxLength * 0.9 ? 'text-orange-600' : ''}>
            {value.length}
          </span>
          /{validation.maxLength}
        </div>
      )}

      {/* Error message */}
      <AnimatePresence>
        {showError && (
          <motion.div
            id={`${name}-error`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-start space-x-2 text-red-600 text-sm"
            role="alert"
            aria-live="polite"
          >
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help text */}
      {helpText && !showError && (
        <div
          id={`${name}-help`}
          className="flex items-start space-x-2 text-gray-500 text-sm"
        >
          <Info className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
          <span>{helpText}</span>
        </div>
      )}
    </div>
  );
}

// Specialized field components
export function EmailField(props: Omit<FormFieldProps, 'type'>) {
  return <FormField {...props} type="email" />;
}

export function PasswordField(props: Omit<FormFieldProps, 'type'>) {
  return <FormField {...props} type="password" />;
}

export function PhoneField(props: Omit<FormFieldProps, 'type'>) {
  return <FormField {...props} type="tel" />;
}

export function TextAreaField(props: Omit<FormFieldProps, 'type'>) {
  return <FormField {...props} type="textarea" />;
}

export function SelectField(props: Omit<FormFieldProps, 'type'>) {
  return <FormField {...props} type="select" />;
}