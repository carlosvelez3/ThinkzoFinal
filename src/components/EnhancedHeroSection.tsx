import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

import AICodeScreen from './AICodeScreen';
import { ParallaxText } from './ParallaxText';
import { ScrollRevealText } from './ScrollRevealText';
import { AnimatedI } from './AnimatedI';

interface EnhancedHeroSectionProps {
  onOpenContactModal: () => void;
}

// Custom hook for typing animation
function useTypingAnimation(texts: string[], speed: number = 80) {
  const [displayedTexts, setDisplayedTexts] = useState<string[]>([]);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentTextIndex >= texts.length) {
      setIsComplete(true);
      return;
    }

    const currentText = texts[currentTextIndex];
    
    if (currentCharIndex < currentText.length) {
      const timer = setTimeout(() => {
        setDisplayedTexts(prev => {
          const newTexts = [...prev];
          newTexts[currentTextIndex] = currentText.slice(0, currentCharIndex + 1);
          return newTexts;
        });
        setCurrentCharIndex(prev => prev + 1);
      }, speed);

      return () => {
        clearTimeout(timer);
      };
    } else {
      // Move to next text after a pause
      const pauseTimer = setTimeout(() => {
        setCurrentTextIndex(prev => prev + 1);
        setCurrentCharIndex(0);
      }, 200);

      return () => {
        clearTimeout(pauseTimer);
      };
    }
  }, [texts, speed, currentTextIndex, currentCharIndex]);

  return { displayedTexts, isComplete };
}

export function EnhancedHeroSection({ onOpenContactModal }: EnhancedHeroSectionProps) {
  const typingTexts = ['Next-Generation', 'AI Solutions'];
  const { displayedTexts, isComplete } = useTypingAnimation(typingTexts);

  // Parallax effects for hero content
  const { scrollY } = useScroll();
  
  // Transform calculations - hooks must be at top level
  const heroY = useTransform(scrollY, [0, 800], [0, -200]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.3]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.95]);
  const floatingY = useTransform(scrollY, [0, 1000], [0, -200]);
  const floatingX = useTransform(scrollY, [0, 1000], [0, -150]);

  // Memoize button click handler
  const handleContactClick = useCallback(() => {
    onOpenContactModal();
  }, [onOpenContactModal]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onOpenContactModal();
    }
  }, [onOpenContactModal]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.2 }}
      className="relative w-full h-[calc(100vh-6rem)] flex items-center overflow-hidden"
      role="main" 
      aria-labelledby="hero-heading"
      style={{ 
        y: heroY, 
        opacity: heroOpacity, 
        scale: heroScale 
      }}
    >
      <div className="max-w-7xl mx-auto w-full h-full lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center flex flex-col px-4">
        
          {/* Left Content */}
          <div className="flex flex-col justify-center text-center lg:text-left text-white">
            <motion.h1 
              id="hero-heading"
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight cursor-default font-montserrat text-white"
              aria-describedby="hero-description"
              style={{
                lineHeight: '1.1',
                letterSpacing: '0.025em',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <ParallaxText speed={0.2}>
                A<AnimatedI />-Powered Web Development Solutions
              </ParallaxText>
            </motion.h1>
          
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.5 }}
            >
              <ScrollRevealText className="text-lg md:text-xl lg:text-2xl mb-8 leading-relaxed opacity-95 font-normal cursor-default text-white max-w-4xl mx-auto lg:mx-0">
                Next-generation solutions for modern businesses. We create smart websites that help your business grow.
              </ScrollRevealText>
            </motion.div>

            <motion.button
              onClick={handleContactClick}
              onKeyDown={handleKeyDown}
              className="group relative bg-gradient-to-r from-cta-yellow to-cta-yellow-hover hover:from-amber-600 hover:to-orange-600 focus:from-amber-600 focus:to-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg md:text-xl transition-all duration-300 transform hover:scale-105 focus:scale-105 shadow-2xl hover:shadow-amber-500/50 focus:shadow-amber-500/50 focus:outline-none focus:ring-4 focus:ring-amber-500/30 focus:ring-offset-2 focus:ring-offset-transparent"
              aria-label="Start your AI journey - Open contact form"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2.4 }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(217, 119, 6, 0.4)",
                textShadow: "0 0 20px rgba(255, 255, 255, 0.9)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">Launch Your AI Journey</span>
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                aria-hidden="true"
                initial={false}
              />
            </motion.button>
          </div>
        
          {/* Right Side — Terminal */}
          <div className="hidden lg:flex items-center justify-center mt-8 lg:mt-0 flex-1">
            <ParallaxText speed={0.1} containerClassName="h-full w-full">
              <AICodeScreen />
            </ParallaxText>
          </div>
      </div>

      {/* Floating Elements with Scroll-Based Animation */}
      <motion.div
        className="absolute top-1/3 right-20 w-32 h-32 bg-gradient-to-r from-cta-yellow/20 to-primary-accent/20 rounded-full blur-2xl"
        style={{ y: floatingY, x: floatingX }}
      />
    </motion.section>
  );
}