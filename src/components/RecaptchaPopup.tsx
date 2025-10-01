import { useEffect, useState } from 'react';
import { Shield, X, CheckCircle2, Fingerprint } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function RecaptchaPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleVerify = () => {
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);

      setTimeout(() => {
        setIsVisible(false);
      }, 1500);
    }, 2000);
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
            className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl p-10 max-w-lg w-full mx-4 border border-cyan-500/20 overflow-hidden"
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

              {/* Custom verification button */}
              <AnimatePresence mode="wait">
                {!isVerified ? (
                  <motion.div
                    key="verify-button"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: 0.5 }}
                    className="flex justify-center mb-8"
                  >
                    <motion.button
                      onClick={handleVerify}
                      disabled={isVerifying}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`
                        relative group px-12 py-6 rounded-2xl font-semibold text-lg
                        transition-all duration-300 overflow-hidden
                        ${isVerifying
                          ? 'bg-slate-700/50 cursor-not-allowed'
                          : 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30'
                        }
                        border-2 ${isVerifying ? 'border-slate-600' : 'border-cyan-500/50 hover:border-cyan-400'}
                      `}
                    >
                      {/* Animated background on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/10 group-hover:to-blue-500/10 transition-all duration-300" />

                      <div className="relative flex items-center gap-4">
                        {isVerifying ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            >
                              <Fingerprint className="w-7 h-7 text-cyan-400" />
                            </motion.div>
                            <span className="text-cyan-400">Verifying...</span>
                          </>
                        ) : (
                          <>
                            <Fingerprint className="w-7 h-7 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                            <span className="text-white group-hover:text-cyan-100 transition-colors">
                              Verify Identity
                            </span>
                          </>
                        )}
                      </div>

                      {/* Shine effect */}
                      {!isVerifying && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                          initial={{ x: '-100%' }}
                          whileHover={{ x: '100%' }}
                          transition={{ duration: 0.6 }}
                        />
                      )}
                    </motion.button>
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

              {/* Footer text */}
              {!isVerified && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-center space-y-2"
                >
                  <p className="text-xs text-slate-500">
                    Protected by advanced security • <span className="text-cyan-500/70 font-semibold">Thinkzo.ai</span>
                  </p>
                  <p className="text-xs text-slate-600">
                    This verification helps us protect against automated attacks
                  </p>
                </motion.div>
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