import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Mail, Calendar, Phone, ArrowRight } from 'lucide-react';

interface SuccessStateProps {
  title?: string;
  message?: string;
  submittedData?: {
    name?: string;
    email?: string;
    projectType?: string;
    [key: string]: any;
  };
  onReset?: () => void;
  showNextSteps?: boolean;
  customNextSteps?: React.ReactNode;
}

export function SuccessState({
  title = "Thank You!",
  message = "Your form has been submitted successfully. We'll get back to you soon.",
  submittedData,
  onReset,
  showNextSteps = true,
  customNextSteps
}: SuccessStateProps) {
  const defaultNextSteps = [
    {
      icon: Mail,
      text: "You'll receive a confirmation email shortly",
      color: "text-blue-600"
    },
    {
      icon: Calendar,
      text: "Our team will review your submission within 24 hours",
      color: "text-green-600"
    },
    {
      icon: Phone,
      text: "We'll contact you to schedule a consultation",
      color: "text-purple-600"
    }
  ];

  return (
    <motion.div
      className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Success Icon */}
      <motion.div
        className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
      >
        <CheckCircle className="w-10 h-10 text-green-600" />
      </motion.div>

      {/* Title and Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {submittedData?.name ? `${title}, ${submittedData.name}!` : title}
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          {message}
        </p>
      </motion.div>

      {/* Submission Summary */}
      {submittedData && (
        <motion.div
          className="bg-gray-50 rounded-lg p-6 mb-8 text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="font-semibold text-gray-900 mb-4 text-center">
            Submission Summary
          </h3>
          <div className="space-y-2">
            {submittedData.email && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium text-gray-900">{submittedData.email}</span>
              </div>
            )}
            {submittedData.projectType && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Project Type:</span>
                <span className="font-medium text-gray-900">{submittedData.projectType}</span>
              </div>
            )}
            {submittedData.phone && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Phone:</span>
                <span className="font-medium text-gray-900">{submittedData.phone}</span>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Next Steps */}
      {showNextSteps && (
        <motion.div
          className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="font-semibold text-blue-900 mb-4">What happens next?</h3>
          
          {customNextSteps || (
            <div className="space-y-3">
              {defaultNextSteps.map((step, index) => (
                <motion.div
                  key={index}
                  className="flex items-start space-x-3 text-left"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + (index * 0.1) }}
                >
                  <div className={`p-2 rounded-full bg-white ${step.color}`}>
                    <step.icon className="w-4 h-4" />
                  </div>
                  <span className="text-blue-800 text-sm">{step.text}</span>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Action Buttons */}
      <motion.div
        className="flex flex-col sm:flex-row gap-4 justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        {onReset && (
          <button
            onClick={onReset}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors"
          >
            Submit Another Form
          </button>
        )}
        
        <button
          onClick={() => window.location.href = '/'}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors flex items-center justify-center"
        >
          Return to Home
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </motion.div>

      {/* Contact Information */}
      <motion.div
        className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <p>
          Have questions? Contact us at{' '}
          <a href="mailto:support@example.com" className="text-blue-600 hover:underline">
            support@example.com
          </a>{' '}
          or{' '}
          <a href="tel:+1234567890" className="text-blue-600 hover:underline">
            (123) 456-7890
          </a>
        </p>
      </motion.div>
    </motion.div>
  );
}

// Specialized success states
export function ContactFormSuccess(props: Omit<SuccessStateProps, 'title' | 'message'>) {
  return (
    <SuccessState
      {...props}
      title="Message Received"
      message="Thank you for reaching out! We've received your message and will respond within 24 hours."
    />
  );
}

export function ProjectFormSuccess(props: Omit<SuccessStateProps, 'title' | 'message'>) {
  const customNextSteps = (
    <div className="space-y-3">
      <motion.div
        className="flex items-start space-x-3 text-left"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="p-2 rounded-full bg-white text-blue-600">
          <Mail className="w-4 h-4" />
        </div>
        <span className="text-blue-800 text-sm">
          Project confirmation email sent to your inbox
        </span>
      </motion.div>
      
      <motion.div
        className="flex items-start space-x-3 text-left"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7 }}
      >
        <div className="p-2 rounded-full bg-white text-green-600">
          <Calendar className="w-4 h-4" />
        </div>
        <span className="text-blue-800 text-sm">
          Our project team will review your requirements
        </span>
      </motion.div>
      
      <motion.div
        className="flex items-start space-x-3 text-left"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="p-2 rounded-full bg-white text-purple-600">
          <Phone className="w-4 h-4" />
        </div>
        <span className="text-blue-800 text-sm">
          We'll schedule a discovery call within 2 business days
        </span>
      </motion.div>
    </div>
  );

  return (
    <SuccessState
      {...props}
      title="Project Submitted"
      message="Your project request has been submitted successfully. We're excited to work with you!"
      customNextSteps={customNextSteps}
    />
  );
}

export function NewsletterSuccess(props: Omit<SuccessStateProps, 'title' | 'message' | 'showNextSteps'>) {
  return (
    <SuccessState
      {...props}
      title="Welcome!"
      message="You've successfully subscribed to our newsletter. Get ready for valuable insights and updates!"
      showNextSteps={false}
    />
  );
}