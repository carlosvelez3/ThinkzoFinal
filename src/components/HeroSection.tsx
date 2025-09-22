import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AICodeScreen } from './AICodeScreen';

export function HeroSection() {
  const [displayedNextGen, setDisplayedNextGen] = useState('');
  const [displayedAISolutions, setDisplayedAISolutions] = useState('');
  
  const fullNextGenText = 'Next-Generation';
  const fullAISolutionsText = 'AI Solutions';

  useEffect(() => {
    const typingSpeed = 80;
    let nextGenIndex = 0;
    let aiSolutionsIndex = 0;
    let nextGenTimer: NodeJS.Timeout;
    let aiSolutionsTimer: NodeJS.Timeout;

    const typeNextGen = () => {
      if (nextGenIndex < fullNextGenText.length) {
        setDisplayedNextGen(fullNextGenText.slice(0, nextGenIndex + 1));
        nextGenIndex++;
        nextGenTimer = setTimeout(typeNextGen, typingSpeed);
      } else {
        // Start typing AI Solutions after a brief pause
        setTimeout(typeAISolutions, 200);
      }
    };

    const typeAISolutions = () => {
      if (aiSolutionsIndex < fullAISolutionsText.length) {
        setDisplayedAISolutions(fullAISolutionsText.slice(0, aiSolutionsIndex + 1));
        aiSolutionsIndex++;
        aiSolutionsTimer = setTimeout(typeAISolutions, typingSpeed);
      }
    };

    // Start the typing animation
    typeNextGen();

    // Cleanup function
    return () => {
      clearTimeout(nextGenTimer);
      clearTimeout(aiSolutionsTimer);
    };
  }, []);

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      scrollToContact();
    }
  };
  return (
    <section className="min-h-screen relative overflow-hidden" role="main" aria-labelledby="hero-heading">
      {/* Main Content Grid */}
      <div className="relative z-10 flex items-start pt-24 px-4">
        <div className="max-w-7xl mx-auto w-full lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
          
          {/* Main Text Content - Full Width */}
          <div className="text-center lg:text-left text-white lg:col-span-1">
            <h1 
              id="hero-heading"
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-8 leading-tight cursor-default font-montserrat text-white"
              aria-describedby="hero-description"
              style={{
                lineHeight: '1.1',
                letterSpacing: '0.025em',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              A<motion.span
                className="inline-block text-primary-accent"
                animate={{
                  scale: [1, 1.1, 1],
                  textShadow: [
                    "0 0 0px rgba(224, 58, 138, 0)",
                    "0 0 20px rgba(224, 58, 138, 0.8)",
                    "0 0 0px rgba(224, 58, 138, 0)"
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                i
              </motion.span> Web Development Solutions
            </h1>
            
            <motion.p 
              id="hero-description"
              className="text-lg md:text-xl lg:text-2xl mb-8 leading-relaxed opacity-95 font-normal cursor-default text-white max-w-4xl mx-auto"
              role="text"
              aria-describedby="hero-heading"
              style={{
                lineHeight: '1.6',
                letterSpacing: '0.01em',
                textShadow: '0 1px 2px rgba(0,0,0,0.2)'
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2.2 }}
              whileHover={{ 
                scale: 1.01,
                opacity: 1,
                textShadow: "0 0 20px rgba(255, 255, 255, 0.5)",
                transition: { duration: 0.3 }
              }}
            >
              We create smart websites that help your business grow. Our AI-powered solutions 
              boost your online presence and drive real results.
            </motion.p>
            
            <motion.button
              onClick={scrollToContact}
              onKeyDown={handleKeyDown}
              className="group relative bg-gradient-to-r from-cta-yellow to-cta-yellow-hover hover:from-amber-600 hover:to-orange-600 focus:from-amber-600 focus:to-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg md:text-xl transition-all duration-300 transform hover:scale-105 focus:scale-105 shadow-2xl hover:shadow-amber-500/50 focus:shadow-amber-500/50 focus:outline-none focus:ring-4 focus:ring-amber-500/30 focus:ring-offset-2 focus:ring-offset-transparent"
              aria-label="Start your AI journey - Navigate to contact form"
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

          {/* Terminal Overlay - Positioned Absolutely */}
          <div className="lg:col-span-1 flex justify-center lg:justify-end w-full hidden lg:flex" aria-hidden="true">
            <AICodeScreen />
          </div>
          
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white/80 to-transparent z-10" aria-hidden="true" />
    </section>
  );
}