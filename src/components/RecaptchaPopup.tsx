import { useEffect, useState } from 'react';
import { Shield, X, CheckCircle2, AlertCircle, Fingerprint, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { checkBrowserEnvironment, logBrowserEnvironment, getBrowserInfo } from '../utils/browserEnvironment';
import type { BrowserEnvironmentResult } from '../utils/browserEnvironment';

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
    recaptchaScriptLoaded?: boolean;
    recaptchaLoadError?: string | null;
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
  const [browserEnvResult, setBrowserEnvResult] = useState<BrowserEnvironmentResult | null>(null);
  const [showBrowserWarnings, setShowBrowserWarnings] = useState(false);

  useEffect(() => {
    const initializeBrowserCheck = async () => {
      console.log('🚀 Initializing browser environment check...');
      const envResult = await checkBrowserEnvironment();
      setBrowserEnvResult(envResult);
      logBrowserEnvironment(envResult);

      if (!envResult.compatible) {
        console.error('❌ Browser environment is not compatible:', envResult.issues);
      }

      if (envResult.warnings.length > 0) {
        console.warn('⚠️ Browser environment warnings:', envResult.warnings);
        setShowBrowserWarnings(true);
      }
    };

    initializeBrowserCheck();

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const waitForRecaptcha = async (maxAttempts = 40, delayMs = 300): Promise<{ success: boolean; error?: string }> => {
    console.log('⏳ Waiting for reCAPTCHA to load...');

    if (window.recaptchaLoadError) {
      console.error('❌ reCAPTCHA load error detected:', window.recaptchaLoadError);
      return { success: false, error: window.recaptchaLoadError };
    }

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      if (window.recaptchaScriptLoaded && typeof window.grecaptcha !== 'undefined' && window.grecaptcha && window.grecaptcha.ready) {
        console.log(`✅ reCAPTCHA loaded successfully after ${attempt + 1} attempts`);
        return { success: true };
      }

      if (window.recaptchaLoadError) {
        console.error('❌ reCAPTCHA load error detected during wait:', window.recaptchaLoadError);
        return { success: false, error: window.recaptchaLoadError };
      }

      if (attempt % 5 === 0 && attempt > 0) {
        console.log(`⏳ Still waiting for reCAPTCHA... (attempt ${attempt + 1}/${maxAttempts})`);
      }

      await new Promise(resolve => setTimeout(resolve, delayMs));
    }

    console.error('❌ reCAPTCHA failed to load after maximum attempts');
    return {
      success: false,
      error: 'reCAPTCHA script failed to load. Please refresh the page, disable ad blockers, and try again.'
    };
  };

  const executeRecaptcha = async () => {
    setIsVerifying(true);
    setError(null);
    setShowBrowserWarnings(false);

    try {
      console.log('🔐 Starting reCAPTCHA verification process...');

      if (browserEnvResult && !browserEnvResult.compatible) {
        console.error('❌ Browser environment check failed:', browserEnvResult.issues);
        const issuesText = browserEnvResult.issues.join(' ');
        setError(issuesText);
        setIsVerifying(false);
        toast.error('Browser environment issue detected');
        return;
      }

      const browserInfo = getBrowserInfo();
      console.log('📊 Browser Info:', browserInfo);

      const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

      if (!siteKey || siteKey.trim() === '') {
        console.error('❌ VITE_RECAPTCHA_SITE_KEY is not configured');
        setError('reCAPTCHA configuration missing. Please contact support.');
        setIsVerifying(false);
        return;
      }

      console.log('🔑 Using site key:', siteKey.substring(0, 15) + '...');

      const recaptchaStatus = await waitForRecaptcha();

      if (!recaptchaStatus.success) {
        console.error('❌ reCAPTCHA script not available:', recaptchaStatus.error);
        setError(recaptchaStatus.error || 'reCAPTCHA failed to load. Please refresh the page and try again.');
        setIsVerifying(false);
        toast.error('reCAPTCHA failed to load');
        return;
      }

      console.log('✅ reCAPTCHA script ready, preparing to execute...');

      await window.grecaptcha.ready(async () => {
        try {
          console.log('🎯 Executing reCAPTCHA with action: verify_identity');
          const startTime = Date.now();

          const token = await window.grecaptcha.execute(siteKey, {
            action: 'verify_identity'
          });

          const executionTime = Date.now() - startTime;
          console.log(`✅ reCAPTCHA token generated in ${executionTime}ms, length: ${token?.length || 0}`);

          if (!token || token.trim() === '') {
            console.error('❌ Empty token received from reCAPTCHA');
            setError('Failed to generate verification token. Please try again.');
            setIsVerifying(false);
            toast.error('Token generation failed');
            return;
          }

          console.log('📤 Sending token to backend for verification...');
          await verifyToken(token);
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Unknown error';
          console.error('❌ reCAPTCHA execution error:', errorMessage, err);

          if (errorMessage.includes('Invalid site key')) {
            setError('Invalid reCAPTCHA configuration. Please contact support or refresh the page.');
            toast.error('Configuration error');
          } else if (errorMessage.includes('timeout')) {
            setError('Verification timed out. Please check your internet connection and try again.');
            toast.error('Verification timeout');
          } else {
            setError('Browser verification failed. Please ensure cookies are enabled, disable ad blockers, and try again.');
            toast.error('Verification failed');
          }
          setIsVerifying(false);
        }
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('❌ Unexpected error in executeRecaptcha:', errorMessage, err);

      if (errorMessage.includes('Invalid site key') || errorMessage.includes('not loaded')) {
        setError('reCAPTCHA configuration error. Please refresh the page or contact support.');
        toast.error('Configuration error');
      } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        setError('Network error. Please check your internet connection and try again.');
        toast.error('Network error');
      } else {
        setError('Verification failed. Please ensure JavaScript is enabled and try again.');
        toast.error('Verification failed');
      }
      setIsVerifying(false);
    }
  };

  const verifyToken = async (token: string) => {
    try {
      console.log('🔍 Verifying token with backend...');
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseAnonKey) {
        console.error('❌ Supabase configuration missing');
        setError('Service configuration error. Please contact support.');
        setIsVerifying(false);
        return;
      }

      const verifyUrl = `${supabaseUrl}/functions/v1/verify-recaptcha`;
      console.log('📡 Verification endpoint:', verifyUrl);

      const browserInfo = getBrowserInfo();
      const startTime = Date.now();

      const response = await fetch(verifyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'X-Browser-Name': browserInfo.name,
          'X-Browser-Version': browserInfo.version,
        },
        body: JSON.stringify({ token }),
      });

      const responseTime = Date.now() - startTime;
      console.log(`📥 Received response in ${responseTime}ms, status: ${response.status}`);

      let data: VerificationResponse;
      try {
        data = await response.json();
        console.log('📦 Response data:', { success: data.success, score: data.score, error: data.error });
      } catch (jsonError) {
        console.error('❌ Failed to parse response JSON:', jsonError);
        setError('Invalid response from verification service.');
        setIsVerifying(false);
        toast.error('Invalid server response');
        return;
      }

      if (!response.ok) {
        console.error(`❌ Verification failed with status ${response.status}:`, data);

        if (response.status === 429) {
          const errorMsg = data.message || 'Too many attempts. Please try again later.';
          setError(errorMsg);
          toast.error('Rate limit exceeded. Please try again later.');
        } else {
          const errorMsg = data.message || data.error || 'Verification failed';

          if (errorMsg.includes('browser-error')) {
            console.warn('⚠️ Browser error detected from backend');
            setError('Browser environment issue detected. Please ensure cookies are enabled, disable ad blockers or privacy extensions, and try a different browser if the issue persists.');
            toast.error('Browser verification failed. Please check your browser settings.');
            setShowBrowserWarnings(true);
          } else if (errorMsg.includes('timeout-or-duplicate')) {
            console.warn('⚠️ Token timeout or duplicate');
            setError('Verification token expired or already used. Please try again.');
            toast.error('Verification expired. Please try again.');
          } else if (errorMsg.includes('invalid-input-response')) {
            console.warn('⚠️ Invalid input response');
            setError('Invalid verification token. Please refresh the page and try again.');
            toast.error('Verification token invalid. Please refresh.');
          } else {
            setError(errorMsg);
            toast.error(errorMsg);
          }
        }
        setIsVerifying(false);
        return;
      }

      if (data.success) {
        console.log('✅ Verification successful!', { score: data.score, verificationId: data.verification_id });
        setIsVerified(true);
        setVerificationScore(data.score || null);
        toast.success('Verification successful!');

        setTimeout(() => {
          setIsVisible(false);
        }, 2500);
      } else {
        const errorMsg = data.message || data.error || 'Verification failed';
        console.error('❌ Verification not successful:', errorMsg);

        if (errorMsg.includes('browser-error')) {
          console.warn('⚠️ Browser error in success response');
          setError('Browser environment issue detected. Please ensure cookies are enabled, disable ad blockers, and try a different browser if the issue persists.');
          toast.error('Browser verification failed.');
          setShowBrowserWarnings(true);
        } else {
          setError(errorMsg);
          toast.error(errorMsg);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('❌ Error in verifyToken:', errorMessage, err);

      if (errorMessage.includes('fetch') || errorMessage.includes('network')) {
        setError('Network error. Please check your connection and try again.');
        toast.error('Network error. Please try again.');
      } else if (errorMessage.includes('abort')) {
        setError('Verification timed out. Please try again.');
        toast.error('Request timed out. Please try again.');
      } else {
        setError('Verification failed. Please try again.');
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

                    {showBrowserWarnings && browserEnvResult && browserEnvResult.warnings.length > 0 && !error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 w-full"
                      >
                        <div className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl text-yellow-400 text-sm">
                          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="font-semibold mb-2">Browser Environment Warnings:</p>
                            <ul className="space-y-1 text-xs">
                              {browserEnvResult.warnings.map((warning, idx) => (
                                <li key={idx}>• {warning}</li>
                              ))}
                            </ul>
                          </div>
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
                            {browserEnvResult && browserEnvResult.warnings.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-red-500/20">
                                <p className="font-semibold mb-1 text-xs">Possible Issues:</p>
                                <ul className="space-y-1 text-xs opacity-80">
                                  {browserEnvResult.warnings.map((warning, idx) => (
                                    <li key={idx}>• {warning}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
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
