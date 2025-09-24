import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Search, PenTool, Cog, Rocket, ArrowRight } from 'lucide-react';
import { ProcessPhaseItem } from './ProcessPhaseItem';
import { useTypingEffect } from '../hooks/useTypingEffect';
import { AnimatedI } from './AnimatedI';

const processPhases = [
  {
    id: 'discovery',
    title: 'Discovery',
    icon: Search,
    description: 'We start by learning about your business goals and current challenges. Our team reviews your existing systems and identifies the best opportunities for improvement.',
    keyActivities: [
      'Stakeholder interviews and requirements gathering',
      'Technical infrastructure assessment',
      'Competitive analysis and market positioning review'
    ],
    outcome: 'A detailed project blueprint with technical specifications, user personas, and strategic recommendations that align with your business objectives.',
    circleGradient: 'from-secondary-purple to-indigo-700'
  },
  {
    id: 'planning',
    title: 'Planning',
    icon: PenTool,
    description: 'We create a detailed plan for your project. This includes wireframes, technical specifications, and a clear timeline with milestones you can track.',
    keyActivities: [
      'Technical architecture and system design',
      'Wireframing and user experience mapping',
      'Integration planning for existing business systems'
    ],
    outcome: 'Complete technical specifications, visual mockups, and a detailed project timeline with defined milestones and deliverables.',
    circleGradient: 'from-secondary-purple to-indigo-700'
  },
  {
    id: 'execution',
    title: 'Execution',
    icon: Cog,
    description: 'Our developers build your solution using the latest technology and security standards. We test everything thoroughly and keep you updated with regular progress reports.',
    keyActivities: [
      'Agile development with regular milestone reviews',
      'System integration and API development',
      'Comprehensive testing and quality assurance'
    ],
    outcome: 'A fully functional, tested solution ready for deployment, complete with documentation and training materials.',
    circleGradient: 'from-secondary-purple to-indigo-700'
  },
  {
    id: 'delivery',
    title: 'Delivery',
    icon: Rocket,
    description: 'We launch your project smoothly with minimal disruption to your business. Our team trains your staff and provides ongoing support to ensure everything runs perfectly.',
    keyActivities: [
      'Strategic deployment and launch coordination',
      'Comprehensive team training and documentation',
      'Performance monitoring and optimization setup'
    ],
    circleGradient: 'from-secondary-purple to-indigo-700'
  }
];

interface ProcessSectionProps {
  onOpenContactModal: () => void;
}

export function ProcessSection({ onOpenContactModal }: ProcessSectionProps) {
  const titleRef = useRef(null);
  const isInView = useInView(titleRef, { once: true, amount: 0.5 });
  const displayedTitle = useTypingEffect({ 
    text: 'Our Digital Agency Process', 
    speed: 100, 
    startTyping: isInView 
  });

  return (
    <motion.section 
      id="process" 
      className="relative py-20 px-4 overflow-hidden bg-cool-gradient-animated animate-background-pan"
      style={{ backgroundSize: '400% 400%' }}
      role="region"
      aria-labelledby="process-heading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated Cool Pattern Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cool-pattern animate-cool-wave opacity-10 pointer-events-none"
        aria-hidden="true"
      />
      
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            id="process-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8 font-montserrat"
            aria-describedby="process-description"
            style={{
              lineHeight: '1.2',
              letterSpacing: '0.02em'
            }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Our A<AnimatedI /> Development Process
          </motion.h2>
          <motion.p 
            id="process-description"
            className="text-lg text-gray-200 max-w-3xl mx-auto leading-relaxed font-poppins mb-12"
            style={{
              lineHeight: '1.6',
              letterSpacing: '0.01em'
            }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Our proven 4-phase development methodology delivers AI-powered websites and applications that drive business growth, increase revenue, and provide measurable ROI for your investment.
          </motion.p>
        </div>

        <div className="space-y-16">
          {processPhases.map((phase, index) => (
            <ProcessPhaseItem 
              key={phase.id}
              phase={phase}
              index={index}
              circleGradient={phase.circleGradient}
            />
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <p 
            className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto font-poppins"
            style={{
              lineHeight: '1.6',
              letterSpacing: '0.01em'
            }}
          >
            Ready to transform your digital presence with a proven methodology? 
            Let's discuss how our systematic approach can deliver measurable results for your business.
          </p>
          <motion.button
            onClick={onOpenContactModal}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onOpenContactModal();
              }
            }}
            className="bg-gradient-to-r from-cta-yellow to-cta-yellow-hover hover:from-amber-600 hover:to-orange-600 focus:from-amber-600 focus:to-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 focus:scale-105 shadow-2xl hover:shadow-amber-500/50 focus:shadow-amber-500/50 focus:outline-none focus:ring-4 focus:ring-amber-500/30 focus:ring-offset-2"
            aria-label="Start your project - Open contact form"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(217, 119, 6, 0.4)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            Start Your Project Today
          </motion.button>
          
        </motion.div>
      </div>
    </motion.section>
  );
}