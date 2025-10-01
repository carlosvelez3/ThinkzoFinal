import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

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
    }, 500);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 border border-gray-700">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Security Verification</h2>
          <p className="text-gray-400">Please verify you are human to continue</p>
        </div>

        <div className="flex justify-center">
          <div id="recaptcha-container"></div>
        </div>

        {isVerified && (
          <div className="mt-4 text-center text-green-400 font-semibold">
            ✓ Verified successfully!
          </div>
        )}
      </div>
    </div>
  );
}