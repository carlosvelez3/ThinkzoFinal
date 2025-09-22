import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatedI } from './AnimatedI';

export function Footer() {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

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
    <motion.footer 
      className="bg-gray-900 text-gray-300 py-8 px-4"
      role="contentinfo"
      aria-label="Site footer"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="max-w-site mx-auto">
        <h2 className="sr-only">Footer Information</h2>
        <motion.div 
          className="flex flex-wrap gap-8 justify-between mb-8"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <motion.div 
            className="flex-1 min-w-64"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h3 className="text-white font-semibold mb-3 font-montserrat">About Thinkzo.ai</h3>
            <p className="text-sm leading-relaxed font-poppins">
              At Thinkzo.ai, we design and deliver A<AnimatedI />-ready web solutions that empower businesses to grow, adapt, and innovate.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-white font-semibold mb-3 font-montserrat">Navigation Links</h3>
            <nav role="navigation" aria-label="Footer navigation">
              <ul className="space-y-2" role="list">
                <li role="listitem">
                  <button
                    onClick={() => scrollToSection('services')}
                    onKeyDown={(e) => handleKeyDown(e, 'services')}
                    className="text-gray-300 hover:text-white focus:text-white text-sm transition-colors focus:outline-none focus:underline"
                    aria-label="Navigate to Services section"
                  >
                    Services
                  </button>
                </li>
                <li role="listitem">
                  <button
                    onClick={() => scrollToSection('pricing')}
                    onKeyDown={(e) => handleKeyDown(e, 'pricing')}
                    className="text-gray-300 hover:text-white focus:text-white text-sm transition-colors focus:outline-none focus:underline"
                    aria-label="Navigate to Pricing section"
                  >
                    Pricing
                  </button>
                </li>
                <li role="listitem">
                  <button
                    onClick={() => scrollToSection('contact')}
                    onKeyDown={(e) => handleKeyDown(e, 'contact')}
                    className="text-gray-300 hover:text-white focus:text-white text-sm transition-colors focus:outline-none focus:underline"
                    aria-label="Navigate to Contact section"
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </nav>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-white font-semibold mb-3 font-montserrat">Contact Information</h3>
            <ul className="space-y-2" role="list">
              <li className="text-sm" role="listitem">
                Email: <a href="mailto:Team@thinkzo.ai" className="text-gray-300 hover:text-white focus:text-white transition-colors focus:outline-none focus:underline" aria-label="Send email to Team@thinkzo.ai">Team@thinkzo.ai</a>
              </li>
            </ul>
          </motion.div>
        </motion.div>
        
        <motion.p 
          className="text-center text-xs text-gray-400 font-poppins"
          role="text"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          viewport={{ once: true }}
        >
          © {currentYear} Thinkzo.ai. All rights reserved.
        </motion.p>
      </div>
    </motion.footer>
  );
}