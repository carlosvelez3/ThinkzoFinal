import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when user has scrolled down 300px
      setIsVisible(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      scrollToTop();
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={scrollToTop}
          onKeyDown={handleKeyDown}
          className="fixed bottom-8 right-8 z-40 bg-gradient-to-r from-primary-accent to-secondary-purple hover:from-primary-accent-hover hover:to-indigo-600 focus:from-primary-accent-hover focus:to-indigo-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl focus:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-accent/30"
          aria-label="Scroll to top of page"
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0, y: 20 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 20 
          }}
          whileHover={{ 
            scale: 1.1,
            boxShadow: "0 10px 25px rgba(6, 182, 212, 0.4)"
          }}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowUp className="w-6 h-6" aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}