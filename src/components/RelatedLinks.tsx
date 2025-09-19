import React from 'react';
import { InternalLink } from './InternalLinkingHelper';
import { ArrowRight } from 'lucide-react';

interface RelatedLink {
  title: string;
  description: string;
  targetSection: string;
  variant?: 'primary' | 'secondary' | 'text' | 'accent';
}

interface RelatedLinksProps {
  title?: string;
  links: RelatedLink[];
  className?: string;
  layout?: 'horizontal' | 'vertical';
}

export function RelatedLinks({ 
  title = "Related Sections", 
  links, 
  className = '',
  layout = 'vertical'
}: RelatedLinksProps) {
  const layoutClasses = layout === 'horizontal' 
    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
    : 'space-y-4';

  return (
    <div className={`bg-gray-50 p-6 rounded-lg border border-gray-200 ${className}`}>
      <h3 className="text-lg font-semibold text-dark-primary mb-4 flex items-center">
        {title}
        <ArrowRight className="w-4 h-4 ml-2 text-primary-accent" aria-hidden="true" />
      </h3>
      
      <div className={layoutClasses}>
        {links.map((link, index) => (
          <div 
            key={index}
            className="p-4 bg-white rounded-lg border border-gray-100 hover:border-primary-accent/30 transition-colors"
          >
            <h4 className="font-medium text-dark-primary mb-2">
              <InternalLink 
                targetSection={link.targetSection}
                variant={link.variant || 'accent'}
                className="text-base"
              >
                {link.title}
              </InternalLink>
            </h4>
            <p className="text-sm text-gray-600 mb-3">
              {link.description}
            </p>
            <InternalLink 
              targetSection={link.targetSection}
              variant="text"
              className="text-sm font-medium"
            >
              Learn more →
            </InternalLink>
          </div>
        ))}
      </div>
    </div>
  );
}