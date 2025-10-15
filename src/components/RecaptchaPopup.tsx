import { useEffect, useState, useRef } from 'react';
import { Shield, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      render: (container: string | HTMLElement, params: {
        sitekey: string;
        theme?: string;
        callback?: (token: string) => void;
        'expired-callback'?: () => void;
        'error-callback'?: () => void;
      }) => number;
      reset: (widgetId?: number) => void;
      getResponse: (widgetId?: number) => string;
    };
  }
}

interface VerificationResponse {
  success: boolean;
  error?: string;
  message?: string;
  verification_id?: string;
  score?: number;
  attempts_remaining?: number;
  blocked_until?: string;
}

export function RecaptchaPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isVisible || !recaptchaContainerRef.current) return;

    const loadRecaptcha = () => {
      if (window.grecaptcha && window.grecaptcha.ready) {
        window.grecaptcha.ready(() => {
          if (recaptchaContainerRef.current && widgetIdRef.current === null) {
            try {
              widgetIdRef.current = window.grecaptcha.render(recaptchaContainerRef.current, {
                sitekey: import.meta.env.VITE_RECAPTCHA_SITE_KEY,
                theme: 'dark',
                callback: handleRecaptchaSuccess,
                'expired-callback': handleRecaptchaExpired,
                'error-callback': handleRecaptchaError,
              });
            } catch (err) {
              console.error('Error rendering reCAPTCHA:', err);
              setError('Failed to load verification widget');
            }
          }
        });
      }
    };

    const checkRecaptchaLoaded = setInterval(() => {
      if (window.grecaptcha && window.grecaptcha.ready) {
        clearInterval(checkRecaptchaLoaded);
        loadRecaptcha();
      }
    }, 100);

    setTimeout(() => clearInterval(checkRecaptchaLoaded), 10000);

    return () => {
      clearInterval(checkRecaptchaLoaded);
    };
  }, [isVisible]);

  const handleRecaptchaSuccess = (token: string) => {
    setRecaptchaToken(token);
    setError(null);
    verifyToken(token);
  };

  const handleRecaptchaExpired = () => {
    setRecaptchaToken(null);
    setError('Verification expired. Please try again.');
    if (widgetIdRef.current !== null) {
      window.grecaptcha.reset(widgetIdRef.current);
    }
  };

  const handleRecaptchaError = () => {
    setError('Verification error occurred. Please try again.');
    if (widgetIdRef.current !== null) {
      window.grecaptcha.reset(widgetIdRef.current);
    }
  };

  const verifyToken = async (token: string) => {
    setIsVerifying(true);
    setError(null);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const response = await fetch(
        `${supabaseUrl}/functions/v1/verify-recaptcha`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseAnonKey}`,
          },
          body: JSON.stringify({ token }),
        }
      );

      const data: VerificationResponse = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          setError(data.message || 'Too many attempts. Please try again later.');
          toast.error('Rate limit exceeded. Please try again later.');
        } else {
          setError(data.message || 'Verification failed');
          toast.error(data.message || 'Verification failed');
        }

        if (widgetIdRef.current !== null) {
          window.grecaptcha.reset(widgetIdRef.current);
        }
        setRecaptchaToken(null);
        setIsVerifying(false);
        return;
      }

      if (data.success) {
        setIsVerified(true);
        toast.success('Verification successful!');

        setTimeout(() => {
          setIsVisible(false);
        }, 2000);
      } else {
        setError(data.message || 'Verification failed');
        toast.error(data.message || 'Verification failed');

        if (widgetIdRef.current !== null) {
          window.grecaptcha.reset(widgetIdRef.current);
        }
        setRecaptchaToken(null);
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError('Network error. Please check your connection and try again.');
      toast.error('Network error. Please try again.');

      if (widgetIdRef.current !== null) {
        window.grecaptcha.reset(widgetIdRef.current);
      }
      setRecaptchaToken(null);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleRetry = () => {
    setError(null);
    setRecaptchaToken(null);
    if (widgetIdRef.current !== null) {
      window.grecaptcha.reset(widgetIdRef.current);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl p-10 max-w-lg w-full mx-4 border border-cyan-500/20 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 animate-pulse" />

            <motion.button
              onClick={handleClose}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="absolute top-4 right-4 text-slate-400 hover:text-cyan-400 transition-colors z-10"
              aria-label="Close"
            >
              <X size={24} />
            </motion.button>

            <div className="relative z-10">
              <div className="flex flex-col items-center mb-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="mb-6 p-5 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl border border-cyan-400/30"
                >
                  <Shield className="w-14 h-14 text-cyan-400" strokeWidth={1.5} />
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-3"
                >
                  Security Verification
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-slate-400 text-center max-w-sm text-lg"
                >
                  Confirm your identity to access Thinkzo.ai
                </motion.p>
              </div>

              <AnimatePresence mode="wait">
                {!isVerified ? (
                  <motion.div
                    key="verify-widget"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col items-center mb-8"
                  >
                    <div
                      ref={recaptchaContainerRef}
                      className="mb-6 flex justify-center transform scale-95 hover:scale-100 transition-transform duration-300"
                    />

                    {isVerifying && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-3 text-cyan-400 mb-4"
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full"
                        />
                        <span className="text-sm font-medium">Verifying...</span>
                      </motion.div>
                    )}

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm mb-4 max-w-md"
                      >
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p>{error}</p>
                          <button
                            onClick={handleRetry}
                            className="mt-2 text-xs underline hover:text-red-300 transition-colors"
                          >
                            Try again
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="flex flex-col items-center justify-center gap-4 p-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-500/40 rounded-2xl mb-8"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
                    >
                      <CheckCircle2 className="w-12 h-12 text-green-400" />
                    </motion.div>
                    <span className="text-green-400 font-bold text-xl">
                      Verification Successful!
                    </span>
                    <span className="text-green-400/70 text-sm">
                      Access granted
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {!isVerified && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-center space-y-2"
                >
                  <p className="text-xs text-slate-500">
                    Protected by Google reCAPTCHA • <span className="text-cyan-500/70 font-semibold">Thinkzo.ai</span>
                  </p>
                  <p className="text-xs text-slate-600">
                    This verification helps us protect against automated attacks
                  </p>
                </motion.div>
              )}
            </div>

            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-10" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
