import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Menu, X, ChevronDown } from 'lucide-react';
import { Breadcrumbs } from './Breadcrumbs';

interface NavigationItem {
  id: string;
  label: string;
  href: string;
  description?: string;
  subItems?: NavigationItem[];
}

const navigationItems: NavigationItem[] = [
  {
    id: 'services',
    label: 'Services',
    href: 'services',
    description: 'AI-powered web development solutions',
    subItems: [
      { id: 'web-dev', label: 'Web Development', href: 'services', description: 'Custom websites & applications' },
      { id: 'ai-automation', label: 'AI & Automation', href: 'services', description: 'Smart business solutions' },
      { id: 'integration', label: 'System Integration', href: 'services', description: 'Connect your tools' },
      { id: 'maintenance', label: 'Maintenance', href: 'services', description: 'Ongoing support' }
    ]
  },
  {
    id: 'process',
    label: 'Process',
    href: 'process',
    description: 'Our proven development methodology'
  },
  {
    id: 'pricing',
    label: 'Pricing',
    href: 'pricing',
    description: 'Transparent, flexible pricing plans'
  },
  {
    id: 'contact',
    label: 'Contact',
    href: 'contact',
    description: 'Start your AI project today'
  }
];

export function Header() {
  const [activeSection, setActiveSection] = useState('hero');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Track active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      setIsScrolled(window.scrollY > 50);

      const sections = ['hero', 'services', 'process', 'pricing', 'contact'];
      
      for (const section of sections) {
        const element = document.getElementById(section === 'hero' ? 'main-content' : section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isMobileMenuOpen && !target.closest('.mobile-menu-container')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId === 'hero' ? 'main-content' : sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, sectionId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      scrollToSection(sectionId);
    }
    if (event.key === 'Escape') {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      <motion.header
        role="banner"
        className={`relative sticky top-0 z-50 py-4 md:py-6 overflow-hidden transition-all duration-300 ${
          isScrolled ? 'backdrop-blur-md bg-black/20' : ''
        }`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover -z-10 transform scale-x-[-1]"
        >
          <source src="/hero_animation_1080p_10s.mp4" type="video/mp4" />
        </video>

        <div className="relative z-20 max-w-site mx-auto flex justify-between items-center px-4 md:px-6 border border-white/30 rounded-2xl py-3 md:py-4 bg-white/5 backdrop-blur-sm shadow-2xl hover:border-white/30 transition-all duration-300">
          
          {/* Logo Section */}
          <div className="flex flex-col">
            <motion.div 
              className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold font-montserrat drop-shadow-lg flex items-center space-x-2 cursor-pointer"
              role="heading"
              aria-level={1}
              whileHover={{ 
                scale: 1.05,
                textShadow: "0 0 25px rgba(224, 58, 138, 0.9)",
                transition: { duration: 0.3 }
              }}
              style={{
                background: 'linear-gradient(135deg, #06B6D4 0%, #6366F1 30%, #0EA5E9 60%, #06B6D4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              <span>Thinkzo.ai</span>
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                aria-hidden="true"
              >
                <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-primary-accent drop-shadow-lg" />
              </motion.div>
            </motion.div>
            
            <motion.p 
              className="text-xs md:text-sm font-poppins font-light text-gray-200 mt-1 tracking-wide"
              role="text"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ 
                color: "#E03A8A",
                textShadow: "0 0 15px rgba(6, 182, 212, 0.6)",
                transition: { duration: 0.3 }
              }}
            >
              web design, development, marketing
            </motion.p>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1" role="navigation" aria-label="Main navigation">
            {navigationItems.map((item) => (
              <div
                key={item.id}
                className="relative"
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <motion.button
                  onClick={() => scrollToSection(item.href)}
                  onKeyDown={(e) => handleKeyDown(e, item.href)}
                  className={`relative px-3 md:px-4 py-2 rounded-lg font-semibold font-poppins text-sm uppercase tracking-wide transition-all duration-300 shadow-lg transform border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent ${
                    activeSection === item.id
                      ? 'bg-gradient-to-r from-cta-yellow to-cta-yellow-hover text-white border-white/40 scale-105 shadow-xl'
                      : 'bg-gradient-to-r from-cta-yellow to-cta-yellow-hover hover:from-amber-600 hover:to-orange-600 focus:from-amber-600 focus:to-orange-600 text-white hover:border-white/40 focus:border-white/60 hover:scale-105 focus:scale-105 hover:shadow-xl focus:shadow-xl'
                  }`}
                  aria-label={`Navigate to ${item.label} section`}
                  aria-current={activeSection === item.id ? 'page' : undefined}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 10px 25px rgba(217, 119, 6, 0.3)",
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="flex items-center">
                    {item.label}
                    {item.subItems && (
                      <ChevronDown className="w-3 h-3 ml-1" aria-hidden="true" />
                    )}
                  </span>
                  
                  {/* Active indicator */}
                  {activeSection === item.id && (
                    <motion.div
                      className="absolute -bottom-1 left-1/2 w-2 h-2 bg-white rounded-full"
                      layoutId="activeIndicator"
                      initial={false}
                      style={{ x: '-50%' }}
                      aria-hidden="true"
                    />
                  )}
                </motion.button>

                {/* Desktop Dropdown */}
                <AnimatePresence>
                  {item.subItems && hoveredItem === item.id && (
                    <motion.div
                      className="absolute top-full left-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl overflow-hidden z-50"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.subItems.map((subItem) => (
                        <button
                          key={subItem.id}
                          onClick={() => scrollToSection(subItem.href)}
                          className="w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors border-b border-gray-700 last:border-b-0"
                        >
                          <div className="font-medium text-white text-sm">{subItem.label}</div>
                          {subItem.description && (
                            <div className="text-xs text-gray-400 mt-1">{subItem.description}</div>
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-white hover:text-primary-accent focus:text-primary-accent transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6" aria-hidden="true" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6" aria-hidden="true" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Breadcrumbs for larger screens */}
        <div className="hidden md:block mt-4 px-6">
          <Breadcrumbs 
            items={[
              { 
                label: navigationItems.find(item => item.id === activeSection)?.label || 'Home', 
                href: activeSection,
                current: true 
              }
            ]}
            className="text-white/70"
          />
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Mobile Menu */}
            <motion.div
              id="mobile-menu"
              className="mobile-menu-container fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-gray-900 border-l border-gray-700 shadow-2xl z-50 lg:hidden overflow-y-auto"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="p-6">
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="text-xl font-bold text-white font-montserrat">
                    Navigation
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-accent rounded-lg"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" aria-hidden="true" />
                  </button>
                </div>

                {/* Mobile Navigation Items */}
                <nav className="space-y-2" role="navigation" aria-label="Mobile navigation">
                  {navigationItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <button
                        onClick={() => scrollToSection(item.href)}
                        onKeyDown={(e) => handleKeyDown(e, item.href)}
                        className={`w-full text-left p-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-accent ${
                          activeSection === item.id
                            ? 'bg-primary-accent text-white shadow-lg'
                            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                        }`}
                        aria-current={activeSection === item.id ? 'page' : undefined}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-lg">{item.label}</div>
                            {item.description && (
                              <div className="text-sm opacity-80 mt-1">{item.description}</div>
                            )}
                          </div>
                          {activeSection === item.id && (
                            <div className="w-2 h-2 bg-white rounded-full" aria-hidden="true" />
                          )}
                        </div>
                      </button>

                      {/* Mobile Sub-items */}
                      {item.subItems && activeSection === item.id && (
                        <motion.div
                          className="ml-4 mt-2 space-y-1"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          transition={{ duration: 0.3 }}
                        >
                          {item.subItems.map((subItem) => (
                            <button
                              key={subItem.id}
                              onClick={() => scrollToSection(subItem.href)}
                              className="w-full text-left p-3 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                            >
                              <div className="font-medium">{subItem.label}</div>
                              {subItem.description && (
                                <div className="text-xs opacity-70 mt-1">{subItem.description}</div>
                              )}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </nav>

                {/* Mobile Menu Footer */}
                <div className="mt-8 pt-6 border-t border-gray-700">
                  <div className="text-center text-gray-400 text-sm">
                    <div className="font-semibold text-white mb-2">Ready to start?</div>
                    <button
                      onClick={() => scrollToSection('contact')}
                      className="w-full bg-gradient-to-r from-cta-yellow to-cta-yellow-hover hover:from-amber-600 hover:to-orange-600 focus:from-amber-600 focus:to-orange-600 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-amber-500/30 focus:ring-offset-2"
                    >
                      Get Started Today
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}