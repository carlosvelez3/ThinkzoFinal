import React from 'react';

interface InternalLinkProps {
  targetSection: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'text' | 'accent';
  ariaLabel?: string;
}

export function InternalLink({ 
  targetSection, 
  children, 
  className = '', 
  variant = 'text',
  ariaLabel 
}: InternalLinkProps) {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      scrollToSection(targetSection);
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-button-gradient-start to-button-gradient-end hover:from-button-gradient-start-hover hover:to-button-gradient-end-hover focus:from-button-gradient-start-hover focus:to-button-gradient-end-hover text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 focus:scale-105 shadow-lg hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500/30';
      case 'secondary':
        return 'border-2 border-primary-accent text-primary-accent hover:bg-primary-accent hover:text-white focus:bg-primary-accent focus:text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-accent/30';
      case 'accent':
        return 'text-primary-accent hover:text-primary-accent-hover focus:text-primary-accent-hover font-semibold underline decoration-2 underline-offset-4 hover:decoration-primary-accent-hover focus:decoration-primary-accent-hover transition-colors focus:outline-none focus:ring-2 focus:ring-primary-accent/30 focus:ring-offset-2 rounded';
      default:
        return 'text-gray-600 hover:text-primary-accent focus:text-primary-accent transition-colors focus:outline-none focus:underline';
    }
  };

  return (
    <button
      onClick={() => scrollToSection(targetSection)}
      onKeyDown={handleKeyDown}
      className={`${getVariantClasses()} ${className}`}
      aria-label={ariaLabel || `Navigate to ${targetSection} section`}
    >
      {children}
    </button>
  );
}