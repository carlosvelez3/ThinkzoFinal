import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { AICodeScreen } from './AICodeScreen';
import { ParallaxText } from './ParallaxText';
import { ScrollRevealText } from './ScrollRevealText';
import { AnimatedI } from './AnimatedI';

interface EnhancedHeroSectionProps {
  onOpenContactModal: () => void;
}

export function EnhancedHeroSection({ onOpenContactModal }: EnhancedHeroSectionProps) {
  const [displayedNextGen, setDisplayedNextGen] = useState('');
  const [displayedAISolutions, setDisplayedAISolutions] = useState('');
  
  const fullNextGenText = 'Next-Generation';
  const fullAISolutionsText = 'AI Solutions';

  // Parallax effects for hero content
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 800], [0, -200]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.3]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.95]);

  useEffect(() => {
    const typingSpeed = 80;
    let nextGenIndex = 0;
    let aiSolutionsIndex = 0;
    let nextGenTimer: NodeJS.Timeout | undefined;
    let aiSolutionsTimer: NodeJS.Timeout | undefined;

    const typeNextGen = (): void => {
      if (nextGenIndex < fullNextGenText.length) {
        setDisplayedNextGen(fullNextGenText.slice(0, nextGenIndex + 1));
        nextGenIndex++;
        nextGenTimer = setTimeout(typeNextGen, typingSpeed);
      } else {
        // Start typing AI Solutions after a brief pause
        setTimeout(typeAISolutions, 200);
      }
    };

    const typeAISolutions = (): void => {
      if (aiSolutionsIndex < fullAISolutionsText.length) {
        setDisplayedAISolutions(fullAISolutionsText.slice(0, aiSolutionsIndex + 1));
        aiSolutionsIndex++;
        aiSolutionsTimer = setTimeout(typeAISolutions, typingSpeed);
      }
    };

    // Start the typing animation
    typeNextGen();

    // Cleanup function
    return (): void => {
      if (nextGenTimer) clearTimeout(nextGenTimer);
      if (aiSolutionsTimer) clearTimeout(aiSolutionsTimer);
    };
  }, []);

  return (
    <section 
      className="h-screen relative overflow-hidden" 
      role="main" 
      aria-labelledby="hero-heading"
    >
      {/* Parallax Hero Content */}
      <motion.div 
        className="relative z-10 pt-24 px-4 h-[calc(100%-6rem)]"
        style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
      >
        <div className="max-w-7xl mx-auto w-full lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center h-full flex flex-col">
          
          {/* Main Text Content with Enhanced Animations */}
          <div className="text-center lg:text-left text-white">
            <motion.h1 
              id="hero-heading"
              className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-8 leading-tight cursor-default font-montserrat text-white"
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
                A<AnimatedI />-Powered Web Development Solutions for Modern Businesses
              </ParallaxText>
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.5 }}
            >
              <ScrollRevealText className="text-lg md:text-xl lg:text-2xl mb-8 leading-relaxed opacity-95 font-normal cursor-default text-white max-w-4xl mx-auto">
                We create smart websites that help your business grow. Our AI-powered solutions boost your online presence and drive real results.
              </ScrollRevealText>
            </motion.div>
            
            <motion.button
              onClick={onOpenContactModal}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onOpenContactModal();
                }
              }}
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
        
          {/* AI Terminal with Parallax */}
          <div className="hidden lg:block mt-8 lg:mt-0 flex-1">
            <ParallaxText speed={0.1} containerClassName="h-full">
              <AICodeScreen />
            </ParallaxText>
          </div>
        
        </div>
      </motion.div>

      {/* Floating Elements with Scroll-Based Animation */}
      <motion.div
        className="absolute top-1/3 right-20 w-32 h-32 bg-gradient-to-r from-cta-yellow/20 to-primary-accent/20 rounded-full blur-2xl"
        style={{
          y: useTransform(scrollY, [0, 1000], [0, -200]),
          x: useTransform(scrollY, [0, 1000], [0, -150])
        }}
        aria-hidden="true"
      />

    </section>
  );
}