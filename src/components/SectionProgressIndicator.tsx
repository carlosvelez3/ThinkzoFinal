import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SectionProgress {
  id: string;
  name: string;
  progress: number;
  isActive: boolean;
}

const sections = [
  { id: 'main-content', name: 'Home' },
  { id: 'services', name: 'Services' },
  { id: 'process', name: 'Process' },
  { id: 'pricing', name: 'Pricing' }
];

export function SectionProgressIndicator() {
  const [sectionProgress, setSectionProgress] = useState<SectionProgress[]>([]);
  const [activeSection, setActiveSection] = useState('main-content');

  useEffect(() => {
    let ticking = false;

    const updateProgress = () => {
      const progress: SectionProgress[] = [];
      let currentActive = 'main-content';
      const scrollTop = window.pageYOffset;
      const windowHeight = window.innerHeight;

      sections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top + scrollTop;
          const elementHeight = rect.height;
          const elementBottom = elementTop + elementHeight;

          // Calculate progress through this section
          let sectionProgress = 0;
          if (scrollTop >= elementTop && scrollTop <= elementBottom) {
            sectionProgress = ((scrollTop - elementTop) / elementHeight) * 100;
            currentActive = section.id;
          } else if (scrollTop > elementBottom) {
            sectionProgress = 100;
          }

          progress.push({
            id: section.id,
            name: section.name,
            progress: Math.min(100, Math.max(0, sectionProgress)),
            isActive: false
          });
        }
      });

      // Mark active section
      const updatedProgress = progress.map(p => ({
        ...p,
        isActive: p.id === currentActive
      }));

      setSectionProgress(updatedProgress);
      setActiveSection(currentActive);
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateProgress);
        ticking = true;
      }
    };

    // Initial calculation
    updateProgress();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
      <nav 
        className="bg-black/20 backdrop-blur-md rounded-full p-2 border border-white/10"
        role="navigation"
        aria-label="Section progress navigation"
      >
        <ul className="space-y-2" role="list">
          {sectionProgress.map((section) => (
            <li key={section.id} role="listitem">
              <button
                onClick={() => scrollToSection(section.id)}
                className={`relative w-3 h-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-accent/50 focus:ring-offset-2 focus:ring-offset-transparent ${
                  section.isActive 
                    ? 'bg-primary-accent shadow-lg shadow-primary-accent/50' 
                    : 'bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Navigate to ${section.name} section (${Math.round(section.progress)}% complete)`}
                title={`${section.name} - ${Math.round(section.progress)}% complete`}
              >
                {/* Progress ring */}
                <svg 
                  className="absolute inset-0 w-full h-full transform -rotate-90"
                  viewBox="0 0 24 24"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    fill="none"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="2"
                  />
                  <motion.circle
                    cx="12"
                    cy="12"
                    r="10"
                    fill="none"
                    stroke={section.isActive ? "#06B6D4" : "rgba(255,255,255,0.5)"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 10}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 10 }}
                    animate={{ 
                      strokeDashoffset: 2 * Math.PI * 10 * (1 - section.progress / 100)
                    }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                </svg>
                
                {/* Active indicator */}
                {section.isActive && (
                  <motion.div
                    className="absolute inset-0 bg-primary-accent rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  />
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}