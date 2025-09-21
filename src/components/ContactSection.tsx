import React, { useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useTypingEffect } from '../hooks/useTypingEffect';
import { InternalLink } from './InternalLinkingHelper';
import { AnimatedI } from './AnimatedI';

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const titleRef = useRef(null);
  const isInView = useInView(titleRef, { once: true, amount: 0.5 });
  const displayedTitle = useTypingEffect({ 
    text: 'Start Your Project', 
    speed: 100, 
    startTyping: isInView 
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  return (
    <motion.section 
      id="contact" 
      className="relative bg-gradient-to-br from-dark-primary to-gray-800 py-8 md:py-12 px-4 overflow-hidden"
      role="region"
      aria-labelledby="contact-heading"
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="max-w-site mx-auto">
        <motion.h2 
          id="contact-heading"
          className="text-3xl md:text-4xl lg:text-4xl font-bold text-center text-white mb-3 md:mb-4 font-retro-mono"
          aria-describedby="contact-description"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Start Your A<AnimatedI /> Project
        </motion.h2>
        <motion.p 
          id="contact-description"
          className="text-base md:text-lg text-center text-gray-300 max-w-3xl mx-auto mb-6 md:mb-8 leading-relaxed"
          role="text"
          aria-describedby="contact-heading"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          Interested in working together? Fill out the form below and one of
          our experts will reach out to discuss your project requirements.
        </motion.p>
        
        {/* Quick Navigation Links */}
        <motion.div 
          className="flex flex-wrap justify-center gap-4 mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <InternalLink 
            targetSection="services" 
            variant="secondary"
            className="text-sm px-4 py-2"
          >
            View Our Services
          </InternalLink>
          <InternalLink 
            targetSection="process" 
            variant="secondary"
            className="text-sm px-4 py-2"
          >
            Our Process
          </InternalLink>
        </motion.div>
        
        <motion.div 
          className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-4 md:p-6 lg:p-8"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <form onSubmit={handleSubmit} noValidate aria-label="Contact form">
            <motion.div 
              className="mb-4 md:mb-5"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              viewport={{ once: true }}
            >
              <label htmlFor="name" className="block text-sm font-bold text-dark-primary mb-1" aria-required="true">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                required
                aria-describedby="name-error"
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm md:text-base focus:outline-none focus:border-primary-accent focus:ring-2 focus:ring-primary-accent/20 transition-all duration-200"
              />
              <div id="name-error" className="sr-only" aria-live="polite"></div>
            </motion.div>
            
            <motion.div 
              className="mb-4 md:mb-5"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              viewport={{ once: true }}
            >
              <label htmlFor="email" className="block text-sm font-bold text-dark-primary mb-1" aria-required="true">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your email"
                required
                aria-describedby="email-error"
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm md:text-base focus:outline-none focus:border-primary-accent focus:ring-2 focus:ring-primary-accent/20 transition-all duration-200"
              />
              <div id="email-error" className="sr-only" aria-live="polite"></div>
            </motion.div>
            
            <motion.div 
              className="mb-4 md:mb-5"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
              viewport={{ once: true }}
            >
              <label htmlFor="phone" className="block text-sm font-bold text-dark-primary mb-1">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Your phone (optional)"
                aria-describedby="phone-help"
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm md:text-base focus:outline-none focus:border-primary-accent focus:ring-2 focus:ring-primary-accent/20 transition-all duration-200"
              />
              <div id="phone-help" className="text-xs text-gray-500 mt-1">Optional - We'll use this for urgent project updates</div>
            </motion.div>
            
            <motion.div 
              className="mb-4 md:mb-5"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.1 }}
              viewport={{ once: true }}
            >
              <label htmlFor="message" className="block text-sm font-bold text-dark-primary mb-1" aria-required="true">
                Project Details
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your project"
                required
                rows={5}
                aria-describedby="message-help message-error"
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm md:text-base resize-y focus:outline-none focus:border-primary-accent focus:ring-2 focus:ring-primary-accent/20 transition-all duration-200"
              />
              <div id="message-help" className="text-xs text-gray-500 mt-1">Please describe your project goals, timeline, and any specific requirements</div>
              <div id="message-error" className="sr-only" aria-live="polite"></div>
            </motion.div>
            
            <motion.button
              type="submit"
              className="bg-gradient-to-r from-primary-accent to-secondary-purple hover:from-primary-accent-hover hover:to-purple-600 focus:from-primary-accent-hover focus:to-purple-600 text-white px-4 md:px-6 py-2 md:py-3 rounded font-semibold text-sm md:text-base cursor-pointer transition-colors w-full md:w-auto focus:outline-none focus:ring-4 focus:ring-primary-accent/30 focus:ring-offset-2"
              aria-describedby="submit-help"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Send Request
            </motion.button>
            <div id="submit-help" className="text-xs text-gray-500 mt-2">We'll respond within 24 hours</div>
          </form>
        </motion.div>
      </div>
    </motion.section>
  );
}