import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
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
    <nav 
      aria-label="Breadcrumb navigation" 
      className={`flex items-center space-x-2 text-sm ${className}`}
      role="navigation"
    >
      <ol className="flex items-center space-x-2" role="list">
        {items.map((item, index) => (
          <li key={index} className="flex items-center" role="listitem">
            {index > 0 && (
              <ChevronRight 
                className="w-4 h-4 text-gray-400 mx-2" 
                aria-hidden="true" 
              />
            )}
            
            {index === 0 && (
              <Home 
                className="w-4 h-4 text-gray-400 mr-2" 
                aria-hidden="true" 
              />
            )}
            
            {item.current ? (
              <span 
                className="text-primary-accent font-medium"
                aria-current="page"
              >
                {item.label}
              </span>
            ) : item.href ? (
              <button
                onClick={() => scrollToSection(item.href!)}
                onKeyDown={(e) => handleKeyDown(e, item.href!)}
                className="text-gray-600 hover:text-primary-accent focus:text-primary-accent transition-colors focus:outline-none focus:underline"
                aria-label={`Navigate to ${item.label}`}
              >
                {item.label}
              </button>
            ) : (
              <span className="text-gray-600">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}