import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function ReadingProgressIndicator() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const updateScrollProgress = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      
      setScrollProgress(Math.min(100, Math.max(0, progress)));
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollProgress);
        ticking = true;
      }
    };

    // Initial calculation
    updateScrollProgress();

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div 
      className="fixed top-0 left-0 right-0 z-50 h-1 bg-black/10 backdrop-blur-sm"
      role="progressbar"
      aria-label="Reading progress"
      aria-valuenow={Math.round(scrollProgress)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        className="h-full bg-gradient-to-r from-primary-accent via-secondary-purple to-cta-yellow shadow-lg"
        style={{
          width: `${scrollProgress}%`,
          boxShadow: scrollProgress > 0 ? '0 0 10px rgba(6, 182, 212, 0.5)' : 'none'
        }}
        initial={{ width: 0 }}
        animate={{ width: `${scrollProgress}%` }}
        transition={{ 
          type: "spring", 
          stiffness: 400, 
          damping: 40,
          mass: 0.5
        }}
      />
      
      {/* Subtle glow effect at the end of the progress bar */}
      {scrollProgress > 5 && (
        <motion.div
          className="absolute top-0 right-0 h-full w-8 bg-gradient-to-l from-primary-accent/30 to-transparent"
          style={{ right: `${100 - scrollProgress}%` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </div>
  );
}