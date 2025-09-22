import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface ProcessPhase {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  keyActivities: string[];
  outcome: string;
}

interface ProcessPhaseItemProps {
  phase: ProcessPhase;
  index: number;
  circleGradient: string;
}

export function ProcessPhaseItem({ phase, index, circleGradient }: ProcessPhaseItemProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: false,
    amount: 0.3,
    margin: "-100px 0px -100px 0px"
  });

  const IconComponent = phase.icon;
  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-8 lg:gap-12`}
      initial={{ 
        opacity: 0, 
        x: isEven ? -100 : 100 
      }}
      animate={{
        opacity: isInView ? 1 : 0,
        x: isInView ? 0 : (isEven ? -100 : 100)
      }}
      transition={{ 
        duration: 0.8, 
        delay: 0.2 + (index * 0.1),
        ease: "easeOut" 
      }}
    >
      {/* Icon and Phase Number */}
      <div className="flex-shrink-0">
        <div className="relative">
          <div className={`w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-br ${circleGradient} rounded-full flex items-center justify-center shadow-2xl`}>
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ 
                scale: 1, 
                rotate: 0,
                transition: {
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  delay: 0.3 + (index * 0.2)
                }
              }}
              whileHover={{
                scale: 1.1,
                rotate: 5,
                transition: { duration: 0.3 }
              }}
              viewport={{ once: false, amount: 0.3 }}
            >
              <IconComponent className="w-10 h-10 lg:w-12 lg:h-12 text-secondary-purple" aria-hidden="true" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 text-center lg:text-left bg-cool-dark-1 p-8 rounded-xl shadow-xl border border-cool-dark-3">
        <h3 
          className="text-2xl lg:text-3xl font-bold text-white mb-4 font-montserrat"
          style={{
            lineHeight: '1.3',
            letterSpacing: '0.015em'
          }}
        >
          Phase {index + 1}: {phase.title}
        </h3>
        
        <p 
          className="text-gray-200 mb-6 leading-relaxed text-base lg:text-lg font-poppins"
          style={{
            lineHeight: '1.6',
            letterSpacing: '0.01em',
            maxWidth: '60ch'
          }}
        >
          {phase.description}
        </p>

        <div className="mb-6">
          <h4 
            className="text-lg font-semibold text-white mb-3 font-poppins"
            style={{
              lineHeight: '1.4',
              letterSpacing: '0.01em'
            }}
          >
            Key Activities
          </h4>
          <ul className="space-y-2" role="list">
            {phase.keyActivities.map((activity, activityIndex) => (
              <li key={activityIndex} className="flex items-start" role="listitem">
                <div className="w-2 h-2 bg-primary-accent rounded-full mt-2 mr-3 flex-shrink-0" aria-hidden="true"></div>
                <span 
                  className="text-gray-200 font-poppins"
                  style={{
                    lineHeight: '1.5',
                    letterSpacing: '0.01em'
                  }}
                >
                  {activity}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg border-l-4 border-primary-accent mb-6">
          <h4 
            className="text-lg font-semibold text-white mb-2 font-poppins"
            style={{
              lineHeight: '1.4',
              letterSpacing: '0.01em'
            }}
          >
            Deliverable
          </h4>
          <p 
            className="text-gray-200 leading-relaxed font-poppins"
            style={{
              lineHeight: '1.6',
              letterSpacing: '0.01em',
              maxWidth: '55ch'
            }}
          >
            {phase.outcome}
          </p>
        </div>
      </div>
    </motion.div>
  );
}