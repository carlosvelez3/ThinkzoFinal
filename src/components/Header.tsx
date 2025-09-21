import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Breadcrumbs } from './Breadcrumbs';

export function Header() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, sectionId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      scrollToSection(sectionId);
    }
  };
  return (
    <motion.header
      role="banner"
      className="relative sticky top-0 z-50 py-6 overflow-hidden"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="relative z-20 max-w-site mx-auto flex justify-between items-center px-6 border border-white/30 rounded-2xl py-4 bg-white/5 backdrop-blur-sm shadow-2xl hover:border-white/30 transition-all duration-300">
        <div className="flex flex-col">
          <motion.div 
            className="text-2xl md:text-3xl lg:text-4xl font-bold font-montserrat drop-shadow-lg flex items-center space-x-2"
            role="heading"
            aria-level={1}
            whileHover={{ 
              scale: 1.05,
              textShadow: "0 0 25px rgba(224, 58, 138, 0.9)",
              transition: { duration: 0.3 }
            }}
            style={{
              background: 'linear-gradient(135deg, #E03A8A 0%, #8B5CF6 30%, #3B82F6 60%, #E03A8A 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            <span>Thinkzo.ai</span>
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              aria-hidden="true"
            >
              <Sparkles className="w-5 h-5 text-primary-accent drop-shadow-lg" />
            </motion.div>
          </motion.div>
          
          <motion.p 
            className="text-sm md:text-base font-poppins font-light text-gray-200 mt-1 tracking-wide"
            role="text"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ 
              color: "#E03A8A",
              textShadow: "0 0 15px rgba(224, 58, 138, 0.6)",
              transition: { duration: 0.3 }
            }}
          >
            web design, development, marketing
          </motion.p>
        </div>
        
        <nav className="flex items-center space-x-6" role="navigation" aria-label="Main navigation">
          <motion.button
            onClick={() => scrollToSection('services')}
            onKeyDown={(e) => handleKeyDown(e, 'services')}
            className="hidden md:block bg-gradient-to-r from-primary-accent to-secondary-purple hover:from-primary-accent hover:to-purple-600 focus:from-primary-accent focus:to-purple-600 text-white px-4 py-2 rounded-lg font-semibold font-poppins text-sm uppercase tracking-wide transition-all duration-300 shadow-lg hover:shadow-xl focus:shadow-xl transform hover:scale-105 focus:scale-105 border border-white/20 hover:border-white/40 focus:border-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent"
            aria-label="Navigate to Services section"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 10px 25px rgba(224, 58, 138, 0.3)",
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            Services
          </motion.button>
          <motion.button
            onClick={() => scrollToSection('process')}
            onKeyDown={(e) => handleKeyDown(e, 'process')}
            className="hidden md:block bg-gradient-to-r from-primary-accent to-secondary-purple hover:from-primary-accent hover:to-purple-600 focus:from-primary-accent focus:to-purple-600 text-white px-4 py-2 rounded-lg font-semibold font-poppins text-sm uppercase tracking-wide transition-all duration-300 shadow-lg hover:shadow-xl focus:shadow-xl transform hover:scale-105 focus:scale-105 border border-white/20 hover:border-white/40 focus:border-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent"
            aria-label="Navigate to Process section"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 10px 25px rgba(224, 58, 138, 0.3)",
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            Process
          </motion.button>
          <motion.button
            onClick={() => scrollToSection('contact')}
            onKeyDown={(e) => handleKeyDown(e, 'contact')}
            className="bg-gradient-to-r from-primary-accent to-secondary-purple hover:from-primary-accent-hover hover:to-purple-600 focus:from-primary-accent-hover focus:to-purple-600 text-white px-4 py-2 rounded-lg font-semibold font-poppins text-sm uppercase tracking-wide transition-all duration-300 shadow-lg hover:shadow-xl focus:shadow-xl transform hover:scale-105 focus:scale-105 border border-white/20 hover:border-white/40 focus:border-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent"
            aria-label="Navigate to Contact section"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 10px 25px rgba(224, 58, 138, 0.3)",
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            Contact
          </motion.button>
        </nav>
      </div>
    </motion.header>
  );
}