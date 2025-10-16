import { useEffect, useState } from 'react';
import { Shield, X, CheckCircle2, AlertCircle, Fingerprint } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
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
  const [verificationScore, setVerificationScore] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const waitForRecaptcha = async (maxAttempts = 20, delayMs = 500): Promise<boolean> => {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      if (typeof window.grecaptcha !== 'undefined' && window.grecaptcha && window.grecaptcha.ready) {
        console.log(`✓ reCAPTCHA loaded successfully after ${attempt} attempts`);
        console.log('grecaptcha object:', typeof window.grecaptcha);
        return true;
      }
      console.log(`⏳ Waiting for reCAPTCHA to load... attempt ${attempt + 1}/${maxAttempts}`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
    console.error('✗ reCAPTCHA failed to load after', maxAttempts, 'attempts over', (maxAttempts * delayMs / 1000), 'seconds');
    return false;
  };

  const executeRecaptcha = async () => {
    setIsVerifying(true);
    setError(null);

    try {
      const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

      if (!siteKey || siteKey.trim() === '') {
        console.error('VITE_RECAPTCHA_SITE_KEY is not configured');
        setError('reCAPTCHA configuration missing. Please contact support.');
        setIsVerifying(false);
        return;
      }

      console.log('🔍 Checking reCAPTCHA availability...');
      console.log('Current location:', window.location.hostname);
      console.log('Site key (first 20 chars):', siteKey.substring(0, 20) + '...');

      const isRecaptchaAvailable = await waitForRecaptcha();

      if (!isRecaptchaAvailable) {
        console.error('✗ reCAPTCHA failed to load after multiple attempts');
        console.error('Possible causes:');
        console.error('1. Script blocked by ad blocker or privacy extension');
        console.error('2. Network connectivity issues');
        console.error('3. Incorrect site key in index.html');
        console.error('4. Domain not registered with this site key');
        setError('reCAPTCHA failed to load. Please disable ad blockers, check your connection, and refresh the page.');
        setIsVerifying(false);
        return;
      }

      console.log('🚀 Executing reCAPTCHA with site key:', siteKey.substring(0, 20) + '...');

      await window.grecaptcha.ready(async () => {
        try {
          console.log('✓ reCAPTCHA ready, executing with action: verify_identity');
          const token = await window.grecaptcha.execute(siteKey, {
            action: 'verify_identity'
          });

          if (!token || token.trim() === '') {
            console.error('✗ reCAPTCHA returned empty token');
            setError('Failed to generate verification token. Please try again.');
            setIsVerifying(false);
            return;
          }

          console.log('✓ reCAPTCHA token generated successfully, length:', token.length);
          console.log('Token preview:', token.substring(0, 30) + '...');
          await verifyToken(token);
        } catch (err) {
          console.error('✗ reCAPTCHA execution error:', err);
          const errorMessage = err instanceof Error ? err.message : 'Unknown error';
          console.error('Error details:', errorMessage);
          console.error('Error type:', typeof err);

          if (errorMessage.includes('Invalid site key')) {
            console.error('DIAGNOSIS: Invalid site key error detected');
            console.error('Solutions:');
            console.error('1. Verify site key in .env matches Google Console');
            console.error('2. Ensure domain is registered in Google reCAPTCHA Console');
            console.error('3. Check that domain is registered WITHOUT http:// or https://');
            console.error('4. Try regenerating site key in Google Console');
            setError('Invalid reCAPTCHA site key. Please verify the configuration in Google Console.');
          } else {
            setError(`Failed to generate verification token: ${errorMessage}`);
          }
          setIsVerifying(false);
        }
      });
    } catch (err) {
      console.error('reCAPTCHA error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Full error object:', err);

      if (errorMessage.includes('Invalid site key') || errorMessage.includes('not loaded')) {
        setError('reCAPTCHA configuration error. Please contact support or try refreshing the page.');
      } else {
        setError(`Verification service error: ${errorMessage}`);
      }
      setIsVerifying(false);
    }
  };

  const verifyToken = async (token: string) => {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseAnonKey) {
        console.error('Supabase configuration missing');
        setError('Service configuration error. Please contact support.');
        setIsVerifying(false);
        return;
      }

      console.log('Sending verification request to Edge Function...');
      const verifyUrl = `${supabaseUrl}/functions/v1/verify-recaptcha`;

      const response = await fetch(verifyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({ token }),
      });

      console.log('Verification response status:', response.status);

      let data: VerificationResponse;
      try {
        data = await response.json();
        console.log('Verification response data:', {
          success: data.success,
          score: data.score,
          error: data.error,
          message: data.message
        });
      } catch (jsonError) {
        console.error('Failed to parse verification response:', jsonError);
        setError('Invalid response from verification service.');
        setIsVerifying(false);
        return;
      }

      if (!response.ok) {
        if (response.status === 429) {
          const errorMsg = data.message || 'Too many attempts. Please try again later.';
          console.error('Rate limit exceeded:', errorMsg);
          setError(errorMsg);
          toast.error('Rate limit exceeded. Please try again later.');
        } else {
          const errorMsg = data.message || data.error || 'Verification failed';
          console.error('Verification failed:', errorMsg, 'Status:', response.status);
          setError(errorMsg);
          toast.error(errorMsg);
        }
        setIsVerifying(false);
        return;
      }

      if (data.success) {
        console.log('Verification successful! Score:', data.score);
        setIsVerified(true);
        setVerificationScore(data.score || null);
        toast.success('Verification successful!');

        setTimeout(() => {
          setIsVisible(false);
        }, 2500);
      } else {
        const errorMsg = data.message || data.error || 'Verification failed';
        console.error('Verification failed:', errorMsg);
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      console.error('Verification error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error details:', errorMessage);

      if (errorMessage.includes('fetch') || errorMessage.includes('network')) {
        setError('Network error. Please check your connection and try again.');
        toast.error('Network error. Please try again.');
      } else {
        setError(`Verification failed: ${errorMessage}`);
        toast.error('Verification failed. Please try again.');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleRetry = () => {
    setError(null);
    setVerificationScore(null);
    executeRecaptcha();
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
                    key="verify-button"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col items-center mb-8"
                  >
                    {!isVerifying && !error && (
                      <motion.button
                        onClick={executeRecaptcha}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative group px-12 py-6 rounded-2xl font-semibold text-lg transition-all duration-300 overflow-hidden bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border-2 border-cyan-500/50 hover:border-cyan-400"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/10 group-hover:to-blue-500/10 transition-all duration-300" />

                        <div className="relative flex items-center gap-4">
                          <Fingerprint className="w-7 h-7 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                          <span className="text-white group-hover:text-cyan-100 transition-colors">
                            Verify Identity
                          </span>
                        </div>

                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                          initial={{ x: '-100%' }}
                          whileHover={{ x: '100%' }}
                          transition={{ duration: 0.6 }}
                        />
                      </motion.button>
                    )}

                    {isVerifying && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center gap-4 p-8"
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        >
                          <Fingerprint className="w-12 h-12 text-cyan-400" />
                        </motion.div>
                        <div className="text-center">
                          <p className="text-cyan-400 font-semibold text-lg mb-2">Verifying...</p>
                          <p className="text-slate-500 text-sm">
                            Analyzing security parameters
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center gap-4 w-full"
                      >
                        <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm w-full">
                          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p>{error}</p>
                          </div>
                        </div>
                        <motion.button
                          onClick={handleRetry}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-8 py-3 rounded-xl font-medium text-base bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-500/50 hover:border-cyan-400 text-white transition-all"
                        >
                          Try Again
                        </motion.button>
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
                    {verificationScore !== null && (
                      <span className="text-green-400/70 text-sm">
                        Trust Score: {(verificationScore * 100).toFixed(0)}%
                      </span>
                    )}
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
                    Protected by Google reCAPTCHA v3 • <span className="text-cyan-500/70 font-semibold">Thinkzo.ai</span>
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
