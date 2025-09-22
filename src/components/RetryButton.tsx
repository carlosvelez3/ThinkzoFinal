import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

interface RetryButtonProps {
  onRetry: () => Promise<void> | void;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  maxRetries?: number;
}

export function RetryButton({ 
  onRetry, 
  disabled = false, 
  className = '', 
  children = 'Retry',
  maxRetries = 3
}: RetryButtonProps) {
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const handleRetry = async () => {
    if (isRetrying || disabled || retryCount >= maxRetries) return;

    setIsRetrying(true);
    try {
      await onRetry();
      setRetryCount(0); // Reset on success
    } catch (error) {
      setRetryCount(prev => prev + 1);
    } finally {
      setIsRetrying(false);
    }
  };

  const isMaxRetriesReached = retryCount >= maxRetries;

  return (
    <motion.button
      onClick={handleRetry}
      disabled={disabled || isRetrying || isMaxRetriesReached}
      className={`
        inline-flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200
        ${isMaxRetriesReached 
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
          : disabled || isRetrying
          ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
          : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg'
        }
        ${className}
      `}
      whileHover={!disabled && !isRetrying && !isMaxRetriesReached ? { scale: 1.02 } : {}}
      whileTap={!disabled && !isRetrying && !isMaxRetriesReached ? { scale: 0.98 } : {}}
    >
      <motion.div
        animate={isRetrying ? { rotate: 360 } : { rotate: 0 }}
        transition={isRetrying ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
        className="mr-2"
      >
        <RefreshCw className="w-4 h-4" />
      </motion.div>
      {isMaxRetriesReached ? 'Max retries reached' : children}
      {retryCount > 0 && !isMaxRetriesReached && (
        <span className="ml-2 text-xs opacity-75">
          ({retryCount}/{maxRetries})
        </span>
      )}
    </motion.button>
  );
}