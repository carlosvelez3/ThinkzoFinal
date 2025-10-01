import { useEffect, useState } from 'react';
import { Shield, X, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

declare global {
  interface Window {
    grecaptcha: any;
  }
}

export function RecaptchaPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isVisible || isVerified) {
      return;
    }

    const loadRecaptcha = () => {
      if (window.grecaptcha && window.grecaptcha.render) {
        try {
          window.grecaptcha.render('recaptcha-container', {
            sitekey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
            callback: handleVerify,
            theme: 'dark',
          });
        } catch (error) {
          console.error('reCAPTCHA render error:', error);
        }
      }
    };

    if (window.grecaptcha && window.grecaptcha.render) {
      loadRecaptcha();
    } else {
      window.addEventListener('load', loadRecaptcha);
      return () => window.removeEventListener('load', loadRecaptcha);
    }
  }, [isVisible, isVerified]);

  const handleVerify = () => {
    setIsVerified(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 1500);
  };

  const handleClose = () => {
    setIsVisible(false);
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
            className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl p-8 max-w-lg w-full mx-4 border border-cyan-500/20 overflow-hidden"
          >
            {/* Animated background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 animate-pulse" />

            {/* Close button */}
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
              {/* Header with icon */}
              <div className="flex flex-col items-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="mb-4 p-4 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl border border-cyan-400/30"
                >
                  <Shield className="w-12 h-12 text-cyan-400" strokeWidth={1.5} />
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2"
                >
                  Security Check
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-slate-400 text-center max-w-sm"
                >
                  Help us maintain a secure environment by completing this quick verification
                </motion.p>
              </div>

              {/* reCAPTCHA container */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex justify-center mb-6"
              >
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 backdrop-blur-sm">
                  <div id="recaptcha-container"></div>
                </div>
              </motion.div>

              {/* Success message */}
              <AnimatePresence>
                {isVerified && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl"
                  >
                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                    <span className="text-green-400 font-semibold text-lg">
                      Verification Successful!
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Footer text */}
              {!isVerified && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-xs text-slate-500 text-center mt-4"
                >
                  Protected by reCAPTCHA • <span className="text-cyan-500/70">Thinkzo.ai</span>
                </motion.p>
              )}
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-10" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}