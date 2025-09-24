import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Cpu, Zap, Bot, Sparkles, Layers, Network, Code, Database, Globe } from 'lucide-react';

// Placeholder AI companies with generic names and icons
const aiCompanies = [
  { name: 'NeuralTech', icon: Brain, color: 'text-blue-500' },
  { name: 'DeepMind Labs', icon: Cpu, color: 'text-purple-500' },
  { name: 'AI Dynamics', icon: Zap, color: 'text-yellow-500' },
  { name: 'BotForge', icon: Bot, color: 'text-green-500' },
  { name: 'Quantum AI', icon: Sparkles, color: 'text-pink-500' },
  { name: 'DataFlow', icon: Database, color: 'text-indigo-500' },
  { name: 'ML Systems', icon: Layers, color: 'text-red-500' },
  { name: 'Neural Net', icon: Network, color: 'text-teal-500' },
  { name: 'CodeAI', icon: Code, color: 'text-orange-500' },
  { name: 'GlobalAI', icon: Globe, color: 'text-cyan-500' },
  { name: 'SmartCore', icon: Brain, color: 'text-violet-500' },
  { name: 'TechFlow', icon: Cpu, color: 'text-emerald-500' }
];

export function MovingCompaniesSection() {
  // Duplicate the companies array to create seamless loop
  const duplicatedCompanies = [...aiCompanies, ...aiCompanies];

  return (
    <section 
      className="relative py-16 overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"
      role="region"
      aria-labelledby="companies-heading"
    >
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill-opacity='0.1'%3E%3Cpolygon fill='%2300BCD4' points='36,1 14,1 14,37 14,37 25,37 25,25 36,25'/%3E%3Cpolygon fill='%233B82F6' points='20,20 20,20 20,30 30,30 30,20 30,20 30,30 40,30 40,20 40,30 50,30 50,40 40,40 40,50 30,50 30,40 20,40'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 
            id="companies-heading"
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 font-montserrat"
            style={{
              lineHeight: '1.2',
              letterSpacing: '0.02em'
            }}
          >
            Powered by Leading AI Technologies
          </h2>
          <p 
            className="text-lg text-gray-300 max-w-3xl mx-auto font-poppins"
            style={{
              lineHeight: '1.6',
              letterSpacing: '0.01em'
            }}
          >
            We integrate with cutting-edge AI platforms to deliver intelligent solutions
          </p>
        </motion.div>

        {/* Moving Companies Container */}
        <div className="relative">
          {/* Gradient Overlays for Fade Effect */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-900 to-transparent z-10 pointer-events-none" aria-hidden="true" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-900 to-transparent z-10 pointer-events-none" aria-hidden="true" />
          
          {/* Scrolling Container */}
          <div 
            className="companies-scroll-container overflow-hidden"
            role="list"
            aria-label="AI technology partners"
          >
            <div className="companies-scroll-track flex items-center space-x-8 md:space-x-12 lg:space-x-16">
              {duplicatedCompanies.map((company, index) => {
                const IconComponent = company.icon;
                return (
                  <motion.div
                    key={`${company.name}-${index}`}
                    className="flex-shrink-0 group cursor-pointer"
                    role="listitem"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex flex-col items-center space-y-3 p-4 rounded-xl bg-gray-800/50 border border-gray-700/50 hover:border-gray-600 hover:bg-gray-800/70 transition-all duration-300 min-w-[120px] md:min-w-[140px]">
                      {/* Company Icon */}
                      <div className={`w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-full bg-gray-700/50 group-hover:bg-gray-700 transition-all duration-300 ${company.color}`}>
                        <IconComponent 
                          className="w-6 h-6 md:w-8 md:h-8 group-hover:scale-110 transition-transform duration-300" 
                          aria-hidden="true"
                        />
                      </div>
                      
                      {/* Company Name */}
                      <div className="text-center">
                        <h3 className="text-sm md:text-base font-semibold text-white group-hover:text-primary-accent transition-colors duration-300 font-poppins">
                          {company.name}
                        </h3>
                        <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                          AI Platform
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Text */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-400 text-sm md:text-base font-poppins">
            Integrating the best AI technologies to power your digital transformation
          </p>
        </motion.div>
      </div>
    </section>
  );
}