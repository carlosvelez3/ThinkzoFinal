import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Search, PenTool, Cog, Rocket, ArrowRight } from 'lucide-react';
import { ProcessPhaseItem } from './ProcessPhaseItem';
import { useTypingEffect } from '../hooks/useTypingEffect';
import { RelatedLinks } from './RelatedLinks';

const processPhases = [
  {
    id: 'discovery',
    title: 'Discovery',
    icon: Search,
    description: 'We start by talking with your key team members and reviewing your current systems to fully understand your manufacturing processes, compliance needs, and market position. Then, we evaluate your digital setup and outline the most important user journeys—for both your internal teams and your customers.',
    keyActivities: [
      'Stakeholder interviews and requirements gathering',
      'Technical infrastructure assessment',
      'Competitive analysis and market positioning review'
    ],
    outcome: 'A detailed project blueprint with technical specifications, user personas, and strategic recommendations that align with your business objectives.',
  },
  {
    id: 'planning',
    title: 'Planning',
    icon: PenTool,
    description: 'Our engineering team develops comprehensive technical architecture and detailed project specifications tailored to your industry\'s regulatory standards and operational complexity. We create wireframes, system integration maps, and establish development milestones that account for manufacturing cycles, compliance testing, and stakeholder approval processes.',
    keyActivities: [
      'Technical architecture and system design',
      'Wireframing and user experience mapping',
      'Integration planning for existing business systems'
    ],
    outcome: 'Complete technical specifications, visual mockups, and a detailed project timeline with defined milestones and deliverables.',
  },
  {
    id: 'execution',
    title: 'Execution',
    icon: Cog,
    description: 'Our development team builds your solution using industry-leading frameworks and security protocols, with continuous integration testing and regular stakeholder reviews. We implement robust data management systems, establish secure API connections, and conduct thorough quality assurance testing that meets your industry\'s stringent performance and compliance standards.',
    keyActivities: [
      'Agile development with regular milestone reviews',
      'System integration and API development',
      'Comprehensive testing and quality assurance'
    ],
    outcome: 'A fully functional, tested solution ready for deployment, complete with documentation and training materials.',
  },
  {
    id: 'delivery',
    title: 'Delivery',
    icon: Rocket,
    description: 'We orchestrate a strategic launch sequence that minimizes operational disruption while maximizing user adoption and system performance. Our team provides comprehensive training for your internal teams, establishes monitoring protocols, and implements ongoing support structures that ensure long-term success and continuous optimization of your digital infrastructure.',
    keyActivities: [
      'Strategic deployment and launch coordination',
      'Comprehensive team training and documentation',
      'Performance monitoring and optimization setup'
    ],
    outcome: 'A successfully launched solution with trained users, established support protocols, and measurable performance improvements.',
  }
];

export function ProcessSection() {
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
      className="relative py-20 px-4 overflow-hidden bg-gray-900"
      role="region"
      aria-labelledby="process-heading"
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            id="process-heading"
            ref={titleRef}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 font-retro-mono"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {displayedTitle}
            <span className="animate-pulse">|</span>
          </motion.h2>
          <motion.p 
           className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed font-retro-mono"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Our systematic approach, honed through years of building robust web applications, ensures we deliver cutting-edge digital solutions that drive measurable business results for our clients.
          </motion.p>
        </div>

        <div className="space-y-16">
          {processPhases.map((phase, index) => (
            <ProcessPhaseItem 
              key={phase.id}
              phase={phase}
              index={index}
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
         <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Ready to transform your digital presence with a proven methodology? 
            Let's discuss how our systematic approach can deliver measurable results for your business.
          </p>
          <motion.button
            onClick={() => {
              const element = document.getElementById('contact');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="bg-gradient-to-r from-primary-accent to-secondary-purple hover:from-primary-accent-hover hover:to-purple-600 focus:from-primary-accent-hover focus:to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 focus:scale-105 shadow-2xl hover:shadow-primary-accent/50 focus:shadow-primary-accent/50 focus:outline-none focus:ring-4 focus:ring-primary-accent/30 focus:ring-offset-2"
            aria-label="Start your project - Navigate to contact form"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(224, 58, 138, 0.4)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            Start Your Project Today
          </motion.button>
          
          {/* Related Links Section */}
          <motion.div
            className="mt-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            viewport={{ once: true }}
          >
            <RelatedLinks
              title="Learn More About Our Services"
              links={[
                {
                  title: "Custom Web Development",
                  description: "Discover our comprehensive web development services and technologies.",
                  targetSection: "services"
                },
                {
                  title: "AI & Automation Solutions",
                  description: "Explore how we integrate AI to enhance your business processes.",
                  targetSection: "services"
                },
                {
                  title: "Get Started Today",
                  description: "Ready to begin your project? Contact us for a consultation.",
                  targetSection: "contact"
                }
              ]}
              layout="horizontal"
              className="max-w-5xl mx-auto"
            />
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}