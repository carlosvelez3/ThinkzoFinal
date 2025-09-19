// SEO and Internal Linking Data
export const seoData = {
  // Anchor text variations for internal links
  anchorTextVariations: {
    services: [
      'our services',
      'web development services',
      'AI solutions',
      'custom development',
      'digital solutions',
      'web design services',
      'automation services'
    ],
    process: [
      'our process',
      'development methodology',
      'project workflow',
      'how we work',
      'our approach',
      'development process',
      'project phases'
    ],
    contact: [
      'contact us',
      'get in touch',
      'start your project',
      'request consultation',
      'discuss your project',
      'get started',
      'reach out'
    ]
  },

  // Page metadata for SEO
  pageMetadata: {
    home: {
      title: 'Thinkzo.ai - Next-Generation AI Web Solutions',
      description: 'Transform your business with AI-driven web development, automation, and digital solutions. Expert team delivering cutting-edge technology.',
      keywords: 'AI web development, automation, digital solutions, custom websites, machine learning',
      canonicalUrl: 'https://thinkzo.ai'
    },
    services: {
      title: 'Web Development & AI Services - Thinkzo.ai',
      description: 'Custom web development, AI automation, system integration, and maintenance services. Modern frameworks, responsive design, and intelligent solutions.',
      keywords: 'web development, AI automation, system integration, WordPress, Shopify, React',
      canonicalUrl: 'https://thinkzo.ai#services'
    },
    process: {
      title: 'Our Development Process - Thinkzo.ai',
      description: 'Discover our proven 4-phase development methodology: Discovery, Planning, Execution, and Delivery. Systematic approach for digital success.',
      keywords: 'development process, project methodology, web development workflow, digital agency process',
      canonicalUrl: 'https://thinkzo.ai#process'
    },
    contact: {
      title: 'Contact Thinkzo.ai - Start Your AI Project',
      description: 'Ready to transform your business? Contact our AI and web development experts for a consultation. Get started with your digital transformation today.',
      keywords: 'contact, consultation, project quote, web development inquiry',
      canonicalUrl: 'https://thinkzo.ai#contact'
    }
  },

  // Structured data for rich snippets
  structuredData: {
    organization: {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Thinkzo.ai",
      "description": "AI-powered web development and digital solutions company",
      "url": "https://thinkzo.ai",
      "logo": "https://thinkzo.ai/logo.png",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+1-XXX-XXX-XXXX",
        "contactType": "customer service",
        "email": "Team@thinkzo.ai"
      },
      "sameAs": [
        "https://linkedin.com/company/thinkzo-ai",
        "https://twitter.com/thinkzo_ai"
      ]
    },
    services: [
      {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Custom Web Development",
        "description": "Responsive, secure websites built on modern frameworks",
        "provider": {
          "@type": "Organization",
          "name": "Thinkzo.ai"
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "AI & Automation",
        "description": "AI-powered search, recommendation engines and automation tools",
        "provider": {
          "@type": "Organization",
          "name": "Thinkzo.ai"
        }
      }
    ]
  }
};

// URL structure best practices
export const urlStructure = {
  // Clean URL patterns
  patterns: {
    services: '#services',
    process: '#process',
    contact: '#contact',
    // Future pages could follow: '/services/web-development', '/services/ai-automation'
  },
  
  // Link attributes best practices
  linkAttributes: {
    internal: {
      // For same-page navigation
      samePage: 'rel="bookmark"',
      // For future internal pages
      crossPage: 'rel="internal"'
    },
    external: {
      // For external links
      standard: 'rel="external noopener noreferrer" target="_blank"',
      // For sponsored/affiliate links
      sponsored: 'rel="sponsored noopener noreferrer" target="_blank"'
    }
  }
};