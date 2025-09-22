import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useInView } from 'framer-motion';
import { X, Code, Brain, Settings, Shield } from 'lucide-react';
import { useTypingEffect } from '../hooks/useTypingEffect';
import { RelatedLinks } from './RelatedLinks';
import { AnimatedI } from './AnimatedI';

const services = [
  {
    id: 'web-development',
    title: 'Custom Web Development',
    description: 'We build fast, secure websites that work perfectly on all devices. Choose from WordPress, Shopify, or custom solutions designed for your business.',
    icon: Code,
    detailedContent: {
      overview: 'We create custom web solutions that perfectly align with your business objectives and technical requirements.',
      features: [
        'Responsive design that works on all devices',
        'Modern frameworks (React, Vue, Angular)',
        'WordPress & WooCommerce expertise',
        'Shopify development and customization',
        'Performance optimization',
        'SEO-friendly architecture'
      ],
      technologies: ['React', 'WordPress', 'Shopify', 'Node.js', 'PHP', 'MySQL'],
      timeline: '4-12 weeks depending on complexity'
    }
  },
  {
    id: 'ai-automation',
    title: <>A<AnimatedI /> & Automation</>,
    description: 'Integrate AI‑powered search, recommendation engines and automation tools to enhance user experience and efficiency.',
    icon: Brain,
    detailedContent: {
      overview: 'We help you save time and money with smart AI tools. Automate repetitive tasks and give your customers better experiences.',
      features: [
        'A<AnimatedI />-powered search and recommendations',
        'Chatbots and virtual assistants',
        'Process automation workflows',
        'Machine learning integration',
        'Natural language processing',
        'Predictive analytics'
      ],
      technologies: ['OpenAI API', 'TensorFlow', 'Python', 'Azure AI', 'AWS AI Services'],
      timeline: '6-16 weeks depending on complexity'
    }
  },
  {
    id: 'system-integration',
    title: 'System Integration',
    description: 'Connect all your business systems together. Get real-time data from your CRM, inventory, and other tools in one place.',
    icon: Settings,
    detailedContent: {
      overview: 'Seamlessly connect all your business systems for unified data management and improved operational efficiency.',
      features: [
        'ERP system integration',
        'CRM connectivity',
        'Inventory management sync',
        'Real-time data synchronization',
        'API development and management',
        'Custom middleware solutions'
      ],
      technologies: ['REST APIs', 'GraphQL', 'Salesforce', 'SAP', 'Microsoft Dynamics', 'Zapier'],
      timeline: '8-20 weeks depending on systems'
    }
  },
  {
    id: 'maintenance-support',
    title: 'Maintenance & Support',
    description: 'Keep your website running smoothly with our ongoing support. We handle updates, security, and backups so you can focus on your business.',
    icon: Shield,
    detailedContent: {
      overview: 'Ensure your digital infrastructure remains secure, updated, and performing at its best with our ongoing support services.',
      features: [
        '24/7 monitoring and support',
        'Regular security updates',
        'Performance optimization',
        'Backup and disaster recovery',
        'Content updates and changes',
        'Technical consultation'
      ],
      technologies: ['Monitoring Tools', 'Security Scanners', 'Backup Solutions', 'CDN Services'],
      timeline: 'Ongoing monthly or annual plans'
    }
  }
];

export function ServicesSection() {
  const [selectedService, setSelectedService] = useState<typeof services[0] | null>(null);
  const titleRef = useRef(null);
  const isInView = useInView(titleRef, { once: true, amount: 0.5 });
  const displayedTitle = useTypingEffect({ 
    text: 'Our Service', 
    speed: 100, 
    startTyping: isInView 
  });

  const openModal = (service: typeof services[0]) => {
    setSelectedService(service);
  };

  const closeModal = () => {
    setSelectedService(null);
  };

  const handleCardKeyDown = (event: React.KeyboardEvent, service: typeof services[0]) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openModal(service);
    }
  };

  const handleModalKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      closeModal();
    }
  };

  const handleGetStartedKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      closeModal();
      const element = document.getElementById('contact');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };
  
  return (
    <>
      <motion.section 
        id="services" 
        className="relative py-20 px-4 overflow-hidden bg-gray-800"
        role="region"
        aria-labelledby="services-heading"
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            id="services-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-white mb-8 md:mb-12 font-montserrat"
            aria-describedby="services-description"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            A<AnimatedI />-Powered Web Development Services
          </motion.h2>
          
          <motion.p
            id="services-description"
            className="text-lg text-gray-300 text-center mb-8 max-w-3xl mx-auto font-poppins"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Complete AI solutions that transform your website and automate your business processes
          </motion.p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <motion.div
                  key={index}
                  onClick={() => openModal(service)}
                  onKeyDown={(e) => handleCardKeyDown(e, service)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Learn more about ${service.title}`}
                  aria-describedby={`service-${index}-description`}
                  className="bg-white border-2 border-gray-200 rounded-xl p-4 md:p-6 lg:p-8 shadow-lg hover:shadow-2xl focus:shadow-2xl cursor-pointer transform transition-all duration-300 hover:-translate-y-2 focus:-translate-y-2 hover:border-primary-accent focus:border-primary-accent group min-h-[220px] md:min-h-[260px] flex flex-col justify-between focus:outline-none focus:ring-4 focus:ring-primary-accent/30"
                  className="bg-gray-800 border-2 border-gray-700 rounded-xl p-4 md:p-6 lg:p-8 shadow-lg hover:shadow-2xl focus:shadow-2xl cursor-pointer transform transition-all duration-300 hover:-translate-y-2 focus:-translate-y-2 hover:border-primary-accent focus:border-primary-accent group min-h-[220px] md:min-h-[260px] flex flex-col justify-between focus:outline-none focus:ring-4 focus:ring-primary-accent/30"
                  initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: 0.4 + (index * 0.1),
                    ease: "easeOut" 
                  }}
                  viewport={{ once: true, amount: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div>
                    <div className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-primary-accent/20 to-secondary-purple/20 rounded-lg mb-4 md:mb-5 lg:mb-6 group-hover:bg-gradient-to-br group-hover:from-primary-accent group-hover:to-secondary-purple transition-all duration-300">
                      <IconComponent className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white group-hover:text-white group-focus:text-white transition-colors duration-300" aria-hidden="true" />
                    </div>
                    <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-3 md:mb-4 group-hover:text-primary-accent transition-colors duration-300 font-montserrat">
                      {service.title}
                    </h3>
                    <p id={`service-${index}-description`} className="text-gray-300 text-sm md:text-base leading-relaxed mb-4 md:mb-6 font-poppins">
                      {service.description}
                    </p>
                  </div>
                  <div className="flex items-center text-primary-accent font-semibold group-hover:text-primary-accent-hover transition-colors duration-300">
                    <span>Learn More</span>
                    <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 group-focus:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Modal */}
      {selectedService && (
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
          onKeyDown={handleModalKeyDown}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div 
            className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-accent/20 to-secondary-purple/20 rounded-lg mr-4">
                    <selectedService.icon className="w-6 h-6 text-white" aria-hidden="true" />
                  </div>
                  <h3 id="modal-title" className="text-3xl font-bold text-white font-montserrat">
                    {selectedService.title}
                  </h3>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 focus:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-accent focus:ring-offset-2 rounded-lg p-1"
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6" aria-hidden="true" />
                </button>
              </div>

              <div id="modal-description" className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xl font-semibold text-white mb-4 font-poppins">Overview</h4>
                  <p className="text-gray-300 mb-6 leading-relaxed font-poppins">
                    {selectedService.detailedContent.overview}
                  </p>

                  <h4 className="text-xl font-semibold text-white mb-4 font-poppins">Key Features</h4>
                  <ul className="space-y-2 mb-6" role="list">
                    {selectedService.detailedContent.features.map((feature, index) => (
                      <li key={index} className="flex items-start" role="listitem">
                        <div className="w-2 h-2 bg-primary-accent rounded-full mt-2 mr-3 flex-shrink-0" aria-hidden="true"></div>
                        <span className="text-gray-300 font-poppins">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xl font-semibold text-white mb-4 font-poppins">Technologies</h4>
                  <div className="flex flex-wrap gap-2 mb-6" role="list" aria-label="Technologies used">
                    {selectedService.detailedContent.technologies.map((tech, index) => (
                      <span
                        key={index}
                        role="listitem"
                        className="px-3 py-1 bg-gradient-to-r from-primary-accent to-secondary-purple text-white rounded-full text-sm font-medium font-poppins"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <h4 className="text-xl font-semibold text-white mb-4 font-poppins">Timeline</h4>
                  <p className="text-gray-300 mb-6 font-poppins">
                    {selectedService.detailedContent.timeline}
                  </p>

                  <button
                    onClick={() => {
                      closeModal();
                      const element = document.getElementById('contact');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    onKeyDown={handleGetStartedKeyDown}
                    className="bg-gradient-to-r from-cta-yellow to-cta-yellow-hover hover:from-amber-600 hover:to-orange-600 focus:from-amber-600 focus:to-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors w-full focus:outline-none focus:ring-4 focus:ring-amber-500/30 focus:ring-offset-2"
                    aria-label="Get started with this service - Navigate to contact form"
                  >
                    Get Started with This Service
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}