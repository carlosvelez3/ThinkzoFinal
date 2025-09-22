import React, { useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef } from 'react';
import { useTypingEffect } from '../hooks/useTypingEffect';
import { InternalLink } from './InternalLinkingHelper';
import { AnimatedI } from './AnimatedI';
import { Check, AlertCircle, ChevronDown, ChevronUp, Zap, Clock, DollarSign } from 'lucide-react';
import { useErrorHandler } from '../hooks/useErrorHandler';
import { useOfflineStatus } from '../hooks/useOfflineStatus';
import { RetryButton } from './RetryButton';

// Smart defaults and project types
const PROJECT_TYPES = [
  { id: 'landing-page', name: 'Landing Page', icon: '🎯', timeline: '1-2 weeks', budget: '$495' },
  { id: 'business-website', name: 'Business Website', icon: '🏢', timeline: '2-4 weeks', budget: '$800-$1,500' },
  { id: 'ecommerce', name: 'E-commerce Store', icon: '🛒', timeline: '4-8 weeks', budget: '$1,500-$3,500' },
  { id: 'web-app', name: 'Web Application', icon: '⚡', timeline: '6-12 weeks', budget: '$3,500+' },
  { id: 'ai-integration', name: 'AI Integration', icon: '🤖', timeline: '4-10 weeks', budget: '$2,000+' },
  { id: 'other', name: 'Other/Custom', icon: '💡', timeline: 'Varies', budget: 'Custom Quote' }
];

const BUDGET_RANGES = [
  { id: 'under-1k', label: 'Under $1,000', value: 'under-1000' },
  { id: '1k-3k', label: '$1,000 - $3,000', value: '1000-3000' },
  { id: '3k-5k', label: '$3,000 - $5,000', value: '3000-5000' },
  { id: '5k-10k', label: '$5,000 - $10,000', value: '5000-10000' },
  { id: '10k-plus', label: '$10,000+', value: '10000-plus' },
  { id: 'discuss', label: 'Let\'s discuss', value: 'discuss' }
];

const TIMELINES = [
  { id: 'asap', label: 'ASAP', value: 'asap' },
  { id: '1-month', label: 'Within 1 month', value: '1-month' },
  { id: '2-3-months', label: '2-3 months', value: '2-3-months' },
  { id: '3-6-months', label: '3-6 months', value: '3-6-months' },
  { id: 'flexible', label: 'Flexible', value: 'flexible' }
];

interface FormData {
  // Essential fields
  email: string;
  projectType: string;
  
  // Progressive fields
  name: string;
  phone: string;
  company: string;
  budget: string;
  timeline: string;
  message: string;
  
  // Smart defaults
  source: string;
  priority: 'high' | 'medium' | 'low';
}

interface ValidationErrors {
  [key: string]: string;
}

export function ContactSection() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    projectType: '',
    name: '',
    phone: '',
    company: '',
    budget: '',
    timeline: '',
    message: '',
    source: 'website',
    priority: 'medium'
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const { handleAsyncError, createValidationError } = useErrorHandler();
  const { isOnline, addToOfflineQueue } = useOfflineStatus();

  const titleRef = useRef(null);
  const isInView = useInView(titleRef, { once: true, amount: 0.5 });
  const displayedTitle = useTypingEffect({ 
    text: 'Start Your Project', 
    speed: 100, 
    startTyping: isInView 
  });

  // Smart validation with real-time feedback
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'email':
        if (!value) return 'Email is required to send you project updates';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
        return '';
      case 'projectType':
        if (!value) return 'Help us understand your project needs';
        return '';
      case 'name':
        if (currentStep > 1 && !value) return 'We\'d love to know what to call you';
        return '';
      default:
        return '';
    }
  };

  // Real-time validation
  useEffect(() => {
    const newErrors: ValidationErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof FormData]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
  }, [formData, currentStep]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-advance logic
    if (name === 'email' && validateField('email', value) === '' && currentStep === 1) {
      setTimeout(() => setCurrentStep(2), 500);
    }
    if (name === 'projectType' && value && currentStep === 2) {
      setTimeout(() => setCurrentStep(3), 300);
    }
  };

  const handleProjectTypeSelect = (projectType: string) => {
    setFormData(prev => ({
      ...prev,
      projectType,
      // Smart defaults based on project type
      priority: projectType === 'landing-page' ? 'high' : 'medium',
      timeline: projectType === 'landing-page' ? '1-month' : 
                projectType === 'web-app' ? '3-6-months' : '2-3-months'
    }));
    setCurrentStep(3);
  };

  const canProceedToStep = (step: number): boolean => {
    switch (step) {
      case 2:
        return formData.email && !errors.email;
      case 3:
        return formData.projectType && formData.email && !errors.email;
      default:
        return true;
    }
  };

  const submitForm = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Enhanced form submitted:', {
      ...formData,
      submittedAt: new Date().toISOString(),
      userAgent: navigator.userAgent,
      referrer: document.referrer
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final validation
    const requiredFields = ['email', 'projectType'];
    const newErrors: ValidationErrors = {};
    
    requiredFields.forEach(field => {
      const error = validateField(field, formData[field as keyof FormData]);
      if (error) newErrors[field] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Focus first error field
      const firstErrorField = Object.keys(newErrors)[0];
      const element = document.getElementById(firstErrorField);
      if (element) {
        element.focus();
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);
    
    const result = await handleAsyncError(async () => {
      if (!isOnline) {
        // Add to offline queue
        addToOfflineQueue(submitForm, formData);
        throw createValidationError(
          'Offline submission queued',
          'Your form has been saved and will be submitted when you\'re back online.',
          { formData }
        );
      }
      
      await submitForm();
      setSubmitSuccess(true);
    }, { formData, action: 'contact_form_submit' });
    
    setIsSubmitting(false);
  };

  const handleRetrySubmit = async () => {
    await handleSubmit({ preventDefault: () => {} } as React.FormEvent);
  };

  const selectedProject = PROJECT_TYPES.find(p => p.id === formData.projectType);

  if (submitSuccess) {
    return (
      <motion.section 
        id="contact" 
        className="relative bg-gradient-to-br from-dark-primary to-gray-800 py-8 md:py-12 px-4 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-site mx-auto text-center">
          <motion.div
            className="bg-gray-800 border border-green-500/30 rounded-lg p-8 max-w-2xl mx-auto"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4 font-montserrat">
              Thank You, {formData.name || 'there'}!
            </h2>
            <p className="text-gray-300 mb-6 font-poppins">
              We've received your {selectedProject?.name.toLowerCase() || 'project'} inquiry. 
              We'll review your requirements and get back to you within 24 hours.
            </p>
            <div className="bg-gray-700 rounded-lg p-4 mb-6">
              <h3 className="text-white font-semibold mb-2">What's Next?</h3>
              <ul className="text-sm text-gray-300 space-y-1 text-left">
                <li>• We'll review your project details</li>
                <li>• Schedule a discovery call within 24 hours</li>
                <li>• Provide a detailed proposal and timeline</li>
              </ul>
            </div>
            <button
              onClick={() => {
                setSubmitSuccess(false);
                setFormData({
                  email: '',
                  projectType: '',
                  name: '',
                  phone: '',
                  company: '',
                  budget: '',
                  timeline: '',
                  message: '',
                  source: 'website',
                  priority: 'medium'
                });
                setCurrentStep(1);
              }}
              className="text-primary-accent hover:text-primary-accent-hover transition-colors"
            >
              Submit Another Project →
            </button>
          </motion.div>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section 
      id="contact" 
      className="relative bg-gradient-to-br from-gray-800 to-gray-700 py-8 md:py-12 px-4 overflow-hidden"
      role="region"
      aria-labelledby="contact-heading"
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="max-w-site mx-auto">
        <motion.h2 
          id="contact-heading"
          className="text-3xl md:text-4xl lg:text-4xl font-bold text-center text-white mb-4 md:mb-6 font-montserrat"
          aria-describedby="contact-description"
          style={{
            lineHeight: '1.2',
            letterSpacing: '0.02em'
          }}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Start Your A<AnimatedI /> Project
        </motion.h2>
        
        <motion.p 
          id="contact-description"
          className="text-base md:text-lg text-center text-gray-200 max-w-3xl mx-auto mb-8 md:mb-10 leading-relaxed font-poppins"
          role="text"
          aria-describedby="contact-heading"
          style={{
            lineHeight: '1.6',
            letterSpacing: '0.01em'
          }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          Let's bring your vision to life. Just a few quick questions to get started.
        </motion.p>

        {/* Progress Indicator */}
        <motion.div 
          className="flex justify-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center space-x-2">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  currentStep >= step 
                    ? 'bg-primary-accent text-white' 
                    : 'bg-gray-700 text-gray-400'
                }`}>
                  {currentStep > step ? <Check className="w-4 h-4" /> : step}
                </div>
                {step < 3 && (
                  <div className={`w-8 h-0.5 mx-2 transition-all duration-300 ${
                    currentStep > step ? 'bg-primary-accent' : 'bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </motion.div>
        
        <motion.div 
          className="max-w-2xl mx-auto bg-gray-700 border border-gray-600 rounded-lg shadow-sm p-4 md:p-6 lg:p-8"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <form onSubmit={handleSubmit} noValidate aria-label="Contact form">
            
            {/* Step 1: Email */}
            <AnimatePresence mode="wait">
              {currentStep >= 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="mb-6"
                >
                  <label 
                    htmlFor="email" 
                    className="block text-sm font-bold text-white mb-2 font-poppins"
                    style={{
                      letterSpacing: '0.01em'
                    }}
                  >
                    What's your email? <span className="text-primary-accent">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    required
                    autoComplete="email"
                    className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                      errors.email 
                        ? 'border-red-500 focus:ring-red-500/20' 
                        : formData.email && !errors.email
                        ? 'border-green-500 focus:ring-green-500/20'
                        : 'border-gray-600 focus:border-primary-accent focus:ring-primary-accent/20'
                    }`}
                  />
                  {errors.email && (
                    <motion.div 
                      className="flex items-center mt-2 text-red-400 text-sm"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {errors.email}
                    </motion.div>
                  )}
                  {formData.email && !errors.email && (
                    <motion.div 
                      className="flex items-center mt-2 text-green-400 text-sm"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Perfect! We'll send updates to this email.
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step 2: Project Type */}
            <AnimatePresence mode="wait">
              {currentStep >= 2 && canProceedToStep(2) && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="mb-6"
                >
                  <label className="block text-sm font-bold text-white mb-4 font-poppins">
                    What type of project do you have in mind? <span className="text-primary-accent">*</span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {PROJECT_TYPES.map((project) => (
                      <motion.button
                        key={project.id}
                        type="button"
                        onClick={() => handleProjectTypeSelect(project.id)}
                        className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                          formData.projectType === project.id
                            ? 'border-primary-accent bg-primary-accent/10'
                            : 'border-gray-600 hover:border-gray-500 bg-gray-700/50'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center mb-2">
                          <span className="text-2xl mr-3">{project.icon}</span>
                          <span className="font-semibold text-white">{project.name}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-300 space-x-4">
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {project.timeline}
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="w-3 h-3 mr-1" />
                            {project.budget}
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                  {errors.projectType && (
                    <motion.div 
                      className="flex items-center mt-2 text-red-400 text-sm"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {errors.projectType}
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step 3: Additional Details */}
            <AnimatePresence mode="wait">
              {currentStep >= 3 && canProceedToStep(3) && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Selected Project Summary */}
                  {selectedProject && (
                    <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                      <div className="flex items-center mb-2">
                        <span className="text-xl mr-2">{selectedProject.icon}</span>
                        <span className="font-semibold text-white">{selectedProject.name}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-300 space-x-4">
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {selectedProject.timeline}
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="w-3 h-3 mr-1" />
                          {selectedProject.budget}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Name Field */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-bold text-white mb-2 font-poppins">
                      What should we call you?
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      autoComplete="name"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-accent focus:ring-2 focus:ring-primary-accent/20 transition-all duration-200"
                    />
                  </div>

                  {/* Progressive Disclosure Toggle */}
                  <div>
                    <button
                      type="button"
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className="flex items-center text-primary-accent hover:text-primary-accent-hover transition-colors text-sm font-medium"
                    >
                      {showAdvanced ? <ChevronUp className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
                      {showAdvanced ? 'Hide' : 'Show'} additional options
                    </button>
                  </div>

                  {/* Advanced Fields */}
                  <AnimatePresence>
                    {showAdvanced && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4 overflow-hidden"
                      >
                        {/* Company */}
                        <div>
                          <label htmlFor="company" className="block text-sm font-bold text-white mb-2 font-poppins">
                            Company (optional)
                          </label>
                          <input
                            type="text"
                            id="company"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            placeholder="Your company name"
                            autoComplete="organization"
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-accent focus:ring-2 focus:ring-primary-accent/20 transition-all duration-200"
                          />
                        </div>

                        {/* Phone */}
                        <div>
                          <label htmlFor="phone" className="block text-sm font-bold text-white mb-2 font-poppins">
                            Phone (optional)
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Your phone number"
                            autoComplete="tel"
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-accent focus:ring-2 focus:ring-primary-accent/20 transition-all duration-200"
                          />
                          <p className="text-xs text-gray-400 mt-1">For urgent project updates only</p>
                        </div>

                        {/* Budget */}
                        <div>
                          <label htmlFor="budget" className="block text-sm font-bold text-white mb-2 font-poppins">
                            Budget Range
                          </label>
                          <select
                            id="budget"
                            name="budget"
                            value={formData.budget}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-accent focus:ring-2 focus:ring-primary-accent/20 transition-all duration-200"
                          >
                            <option value="">Select budget range</option>
                            {BUDGET_RANGES.map((range) => (
                              <option key={range.id} value={range.value}>
                                {range.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Timeline */}
                        <div>
                          <label htmlFor="timeline" className="block text-sm font-bold text-white mb-2 font-poppins">
                            Timeline
                          </label>
                          <select
                            id="timeline"
                            name="timeline"
                            value={formData.timeline}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-accent focus:ring-2 focus:ring-primary-accent/20 transition-all duration-200"
                          >
                            <option value="">When do you need this completed?</option>
                            {TIMELINES.map((timeline) => (
                              <option key={timeline.id} value={timeline.value}>
                                {timeline.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-bold text-white mb-2 font-poppins">
                      Tell us about your project
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder={selectedProject 
                        ? `Describe your ${selectedProject.name.toLowerCase()} project. What features do you need? Who is your target audience?`
                        : "Describe your project goals, target audience, and any specific requirements"
                      }
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 resize-y focus:outline-none focus:border-primary-accent focus:ring-2 focus:ring-primary-accent/20 transition-all duration-200"
                    />
                    <p className="text-xs text-gray-400 mt-1">The more details you provide, the better we can help you</p>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting || !canProceedToStep(3) || (!isOnline && offlineQueue.length > 5)}
                    className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-all duration-300 transform focus:outline-none focus:ring-4 focus:ring-offset-2 ${
                      isSubmitting || !canProceedToStep(3) || (!isOnline && offlineQueue.length > 5)
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-cta-yellow to-cta-yellow-hover hover:from-amber-600 hover:to-orange-600 focus:from-amber-600 focus:to-orange-600 text-white hover:scale-105 focus:scale-105 shadow-lg hover:shadow-xl focus:shadow-xl focus:ring-amber-500/30'
                    }`}
                    whileHover={!isSubmitting && canProceedToStep(3) && (isOnline || offlineQueue.length <= 5) ? { scale: 1.02 } : {}}
                    whileTap={!isSubmitting && canProceedToStep(3) && (isOnline || offlineQueue.length <= 5) ? { scale: 0.98 } : {}}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <motion.div
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        Sending...
                      </div>
                    ) : !isOnline && offlineQueue.length > 5 ? (
                      'Offline queue full'
                    ) : !isOnline ? (
                      'Save for later (offline)'
                    ) : (
                      <div className="flex items-center justify-center">
                        <Zap className="w-5 h-5 mr-2" />
                        Send Project Request
                      </div>
                    )}
                  </motion.button>
                  
                  <div className="text-center space-y-2">
                    <p className="text-xs text-gray-400">
                      {isOnline 
                        ? "We'll respond within 24 hours with next steps"
                        : "Form will be submitted when you're back online"
                      }
                    </p>
                    {!isOnline && (
                      <p className="text-xs text-orange-400">
                        📱 Currently offline - your form will be saved locally
                      </p>
                    )}
                  </div>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>
      </div>
    </motion.section>
  );
}