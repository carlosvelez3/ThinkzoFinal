import React from 'react';

// Validation utility functions and types
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string, formData?: any) => string | null;
  dependencies?: string[];
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Common validation patterns
export const ValidationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
  strongPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  name: /^[a-zA-Z\s'-]+$/,
  zipCode: /^\d{5}(-\d{4})?$/,
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/
};

// Validation error messages
export const ValidationMessages = {
  required: (fieldName: string) => `${fieldName} is required`,
  minLength: (fieldName: string, min: number) => `${fieldName} must be at least ${min} characters`,
  maxLength: (fieldName: string, max: number) => `${fieldName} must be no more than ${max} characters`,
  email: 'Please enter a valid email address',
  phone: 'Please enter a valid phone number (e.g., (555) 123-4567)',
  strongPassword: 'Password must contain uppercase, lowercase, number, and special character',
  passwordMatch: 'Passwords do not match',
  name: 'Name can only contain letters, spaces, hyphens, and apostrophes',
  zipCode: 'Please enter a valid ZIP code',
  url: 'Please enter a valid URL'
};

// Core validation function
export function validateField(
  value: string,
  rules: ValidationRule,
  fieldName: string,
  formData?: any
): ValidationResult {
  // Required validation
  if (rules.required && (!value || value.trim() === '')) {
    return {
      isValid: false,
      error: ValidationMessages.required(fieldName)
    };
  }

  // Skip other validations if field is empty and not required
  if (!value || value.trim() === '') {
    return { isValid: true };
  }

  // Length validations
  if (rules.minLength && value.length < rules.minLength) {
    return {
      isValid: false,
      error: ValidationMessages.minLength(fieldName, rules.minLength)
    };
  }

  if (rules.maxLength && value.length > rules.maxLength) {
    return {
      isValid: false,
      error: ValidationMessages.maxLength(fieldName, rules.maxLength)
    };
  }

  // Pattern validation
  if (rules.pattern && !rules.pattern.test(value)) {
    // Use specific error messages for common patterns
    if (rules.pattern === ValidationPatterns.email) {
      return { isValid: false, error: ValidationMessages.email };
    }
    if (rules.pattern === ValidationPatterns.phone) {
      return { isValid: false, error: ValidationMessages.phone };
    }
    if (rules.pattern === ValidationPatterns.name) {
      return { isValid: false, error: ValidationMessages.name };
    }
    
    return {
      isValid: false,
      error: `Please enter a valid ${fieldName.toLowerCase()}`
    };
  }

  // Custom validation
  if (rules.custom) {
    const customError = rules.custom(value, formData);
    if (customError) {
      return { isValid: false, error: customError };
    }
  }

  return { isValid: true };
}

// Validate entire form
export function validateForm(
  formData: { [key: string]: string },
  validationRules: { [key: string]: ValidationRule }
): { isValid: boolean; errors: { [key: string]: string } } {
  const errors: { [key: string]: string } = {};
  let isValid = true;

  for (const [fieldName, rules] of Object.entries(validationRules)) {
    const value = formData[fieldName] || '';
    const result = validateField(value, rules, fieldName, formData);
    
    if (!result.isValid && result.error) {
      errors[fieldName] = result.error;
      isValid = false;
    }
  }

  return { isValid, errors };
}

// Format utilities
export const FormatUtils = {
  // Format phone number as user types
  formatPhoneNumber: (value: string): string => {
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
  },

  // Format credit card number
  formatCreditCard: (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})$/);
    if (match) {
      return [match[1], match[2], match[3], match[4]]
        .filter(Boolean)
        .join(' ');
    }
    return value;
  },

  // Format ZIP code
  formatZipCode: (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 5) {
      return cleaned;
    }
    return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 9)}`;
  },

  // Capitalize first letter of each word
  formatName: (value: string): string => {
    return value
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
};

// Password strength calculator
export function calculatePasswordStrength(password: string) {
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
    percentage: (strength / 5) * 100,
    score: strength
  };
}

// Debounce utility for validation
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Common validation rules presets
export const CommonValidationRules = {
  firstName: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: ValidationPatterns.name,
    custom: (value: string) => {
      if (value && value.trim().length < 2) return 'First name must be at least 2 characters';
      if (value && !/^[a-zA-Z\s'-]+$/.test(value)) return ValidationMessages.name;
      return null;
    }
  },

  lastName: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: ValidationPatterns.name,
    custom: (value: string) => {
      if (value && value.trim().length < 2) return 'Last name must be at least 2 characters';
      if (value && !/^[a-zA-Z\s'-]+$/.test(value)) return ValidationMessages.name;
      return null;
    }
  },

  email: {
    required: true,
    pattern: ValidationPatterns.email,
    custom: (value: string) => {
      if (!value) return ValidationMessages.required('Email');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return ValidationMessages.email;
      if (value.length > 254) return 'Email address is too long';
      return null;
    }
  },

  phone: {
    required: true,
    pattern: ValidationPatterns.phone,
    custom: (value: string) => {
      if (!value) return ValidationMessages.required('Phone number');
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length !== 10) return 'Phone number must be 10 digits';
      if (!/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(value)) {
        return ValidationMessages.phone;
      }
      return null;
    }
  },

  password: {
    required: true,
    minLength: 8,
    custom: (value: string) => {
      if (!value) return ValidationMessages.required('Password');
      if (value.length < 8) return 'Password must be at least 8 characters long';
      if (!/(?=.*[a-z])/.test(value)) return 'Password must contain at least one lowercase letter';
      if (!/(?=.*[A-Z])/.test(value)) return 'Password must contain at least one uppercase letter';
      if (!/(?=.*\d)/.test(value)) return 'Password must contain at least one number';
      if (!/(?=.*[@$!%*?&])/.test(value)) return 'Password must contain at least one special character (@$!%*?&)';
      return null;
    }
  },

  confirmPassword: {
    required: true,
    dependencies: ['password'],
    custom: (value: string, formData: any) => {
      if (!value) return ValidationMessages.required('Confirm password');
      if (formData && value !== formData.password) return ValidationMessages.passwordMatch;
      return null;
    }
  },

  zipCode: {
    pattern: ValidationPatterns.zipCode,
    custom: (value: string) => {
      if (value && !ValidationPatterns.zipCode.test(value)) return ValidationMessages.zipCode;
      return null;
    }
  },

  website: {
    pattern: ValidationPatterns.url,
    custom: (value: string) => {
      if (value && !ValidationPatterns.url.test(value)) return ValidationMessages.url;
      return null;
    }
  }
};

// Accessibility helpers
export const AccessibilityHelpers = {
  // Generate ARIA attributes for form fields
  getFieldAriaAttributes: (
    fieldName: string,
    hasError: boolean,
    hasHelp: boolean
  ) => ({
    'aria-invalid': hasError,
    'aria-describedby': [
      hasError ? `${fieldName}-error` : null,
      hasHelp ? `${fieldName}-help` : null
    ].filter(Boolean).join(' ') || undefined
  }),

  // Generate IDs for error and help text
  getFieldIds: (fieldName: string) => ({
    error: `${fieldName}-error`,
    help: `${fieldName}-help`
  })
};