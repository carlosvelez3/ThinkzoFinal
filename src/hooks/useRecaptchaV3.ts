import { useState, useEffect, useCallback } from 'react';

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

const RECAPTCHA_V3_SITE_KEY = '6LeH0tIrAAAAAFRQ0NklcGxc-l35nhiEpaRvbHcB';
const IS_LOCALHOST = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

export function useRecaptchaV3() {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Skip reCAPTCHA initialization on localhost
    if (IS_LOCALHOST) {
      setIsReady(true);
      setIsLoading(false);
      return;
    }

    // Check if reCAPTCHA is already loaded
    if (window.grecaptcha && typeof window.grecaptcha.ready === 'function') {
      window.grecaptcha.ready(() => {
        setIsReady(true);
        setIsLoading(false);
      });
    } else {
      // Wait for script to load
      const checkRecaptcha = () => {
        if (window.grecaptcha && typeof window.grecaptcha.ready === 'function') {
          window.grecaptcha.ready(() => {
            setIsReady(true);
            setIsLoading(false);
          });
        } else {
          // Retry after a short delay
          setTimeout(checkRecaptcha, 100);
        }
      };
      
      checkRecaptcha();
      
      // Set a timeout to handle cases where reCAPTCHA fails to load
      const timeout = setTimeout(() => {
        if (!isReady) {
          setError('reCAPTCHA failed to load');
          setIsLoading(false);
        }
      }, 10000); // 10 second timeout
      
      return () => clearTimeout(timeout);
    }
  }, [isReady, IS_LOCALHOST]);

  const executeRecaptcha = useCallback(async (action: string): Promise<string | null> => {
    // Return a mock token for localhost development
    if (IS_LOCALHOST) {
      console.log('reCAPTCHA bypassed for localhost development');
      return 'localhost-development-token';
    }

    if (!isReady || !window.grecaptcha) {
      setError('reCAPTCHA is not ready');
      return null;
    }

    try {
      const token = await window.grecaptcha.execute(RECAPTCHA_V3_SITE_KEY, { action });
      setError(null);
      return token;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'reCAPTCHA execution failed';
      setError(errorMessage);
      console.error('reCAPTCHA execution error:', err);
      return null;
    }
  }, [isReady, IS_LOCALHOST]);

  return {
    isReady,
    isLoading,
    error,
    executeRecaptcha
  };
}