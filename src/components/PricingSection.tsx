import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Check, Star, Zap, Crown, Layout } from 'lucide-react';

const pricingTiers = [
  {
    id: 'landing-page',
    name: 'Landing Page',
    icon: Layout,
    price: '$495',
    period: 'one-time',
    description: 'Single-page focused design optimized for conversions and marketing campaigns',
    features: [
      'One-page design focused on conversions',
      'Clear headlines and compelling copy',
      'Customer testimonials and trust signals',
      'Strong call-to-action buttons',
      'Simple navigation that guides visitors',
      'Mobile-responsive design for all devices',
      'One primary CTA button strategically placed',
      'Up to 2 rounds of revisions included',
      '5-7 business days delivery'
    ],
    popular: false,
    ctaText: 'Get Started',
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'basic',
    name: 'Basic',
    icon: Zap,
    price: '$800 – $1,500',
    period: 'one-time',
    monthlyPrice: '$100 – $200',
    monthlyPeriod: 'Payment options available',
    description: 'Perfect for small businesses needing a simple, professional web presence',
    features: [
      '3-5 essential pages for your business',
      'Professional template with your branding',
      'Mobile responsive design',
      'Basic SEO optimization',
      'Basic site speed optimization',
      'Contact form integration',
      'Image gallery functionality'
    ],
    popular: false,
    ctaText: 'Get Started',
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'standard',
    name: 'Standard',
    icon: Star,
    price: '$1,500 – $3,500',
    period: 'one-time',
    monthlyPrice: '$200 – $400',
    monthlyPeriod: 'Payment options available',
    description: 'Ideal for growing businesses needing more customization and functionality',
    features: [
      '6-10 pages with rich content',
      'Custom design with your brand colors and graphics',
      'Blog and content management system',
      'Advanced SEO and speed optimization',
      'Google Analytics integration',
      'Social media integration',
      'Basic payment gateway (if needed)',
      'More design revisions included'
    ],
    popular: true,
    ctaText: 'Most Popular',
    color: 'from-primary-accent to-secondary-purple'
  },
  {
    id: 'enhanced',
    name: 'Enhanced',
    icon: Crown,
    price: '$3,500 – $6,000',
    period: 'one-time',
    monthlyPrice: '$400 – $700',
    monthlyPeriod: 'Payment options available',
    description: 'Comprehensive solution for businesses needing advanced functionality and custom design',
    features: [
      '10+ pages with advanced features',
      'Custom design from scratch',
      'E-commerce, user accounts, and booking systems',
      'Complete SEO and performance optimization',
      'Content creation assistance',
      'CRM and email marketing integrations',
      'Payment processing integration',
      'Post-launch support & training',
      'Advanced analytics and reporting'
    ],
    popular: false,
    ctaText: 'Get Enhanced',
    color: 'from-purple-600 to-indigo-600'
  }
];

export function PricingSection() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      scrollToContact();
    }
  };

  return (
    <motion.section 
      ref={sectionRef}
      id="pricing" 
      className="relative py-20 px-4 overflow-hidden bg-cool-gradient-animated animate-background-pan"
      style={{ backgroundSize: '400% 400%' }}
      role="region"
      aria-labelledby="pricing-heading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ y }}
    >
      {/* Animated Cool Pattern Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cool-pattern animate-cool-wave opacity-10 pointer-events-none"
        aria-hidden="true"
      />
      
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h2 
            id="pricing-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 font-montserrat"
            aria-describedby="pricing-description"
          >
            Web Development Service Tiers
          </h2>
          <p 
            id="pricing-description"
            className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed font-poppins"
          >
            Choose the right plan for your business. Prices may vary based on your specific needs and project complexity.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {pricingTiers.map((tier, index) => {
            const IconComponent = tier.icon;
            return (
              <motion.div
                key={tier.id}
                className={`relative bg-cool-dark-2 rounded-2xl shadow-xl border-2 flex flex-col h-full ${
                  tier.popular 
                    ? 'border-cool-teal-2 shadow-2xl transform scale-105' 
                    : 'border-cool-dark-3 hover:border-cool-teal-2/50'
                } transition-all duration-300 hover:shadow-2xl hover:-translate-y-2`}
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.4 + (index * 0.1),
                  ease: "easeOut" 
                }}
                viewport={{ once: true, amount: 0.3 }}
                whileHover={{ scale: tier.popular ? 1.05 : 1.02 }}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-primary-accent to-secondary-purple text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="p-8 flex flex-col flex-grow">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${tier.color} rounded-full mb-4`}>
                      <IconComponent className="w-8 h-8 text-white" aria-hidden="true" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2 font-montserrat">
                      {tier.name}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed font-poppins">
                      {tier.description}
                    </p>
                  </div>

                  {/* Pricing */}
                  <div className="text-center mb-8">
                    {tier.monthlyPrice ? (
                      <div className="space-y-3">
                        {/* One-time Payment Option */}
                        <div className="p-3 bg-cool-dark-3 rounded-lg border border-cool-dark-2">
                          <div className="flex items-baseline justify-center">
                            <span className="text-2xl font-bold text-white">
                              {tier.price}
                            </span>
                            <span className="text-gray-400 ml-2 text-sm">
                              {tier.period}
                            </span>
                          </div>
                          <p className="text-xs text-gray-300 mt-1">Full payment upfront</p>
                        </div>
                        
                        {/* Monthly Payment Option */}
                        <div className="p-3 bg-cool-blue-1/20 rounded-lg border-2 border-cool-blue-2/50">
                          <div className="text-center">
                            <span className="text-lg font-semibold text-blue-400">
                              {tier.monthlyPeriod}
                            </span>
                          </div>
                          <p className="text-xs text-blue-300 mt-2">Contact us for flexible payment plans</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-baseline justify-center">
                        <span className="text-4xl font-bold text-white">
                          {tier.price}
                        </span>
                        {tier.period !== 'quote' && (
                          <span className="text-gray-400 ml-2">
                            {tier.period}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <div className="mb-8 flex-grow">
                    <ul className="space-y-3" role="list">
                      {tier.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start" role="listitem">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5 mr-3" aria-hidden="true" />
                          <span className="text-gray-300 text-sm font-poppins">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={scrollToContact}
                    onKeyDown={handleKeyDown}
                    className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 focus:scale-105 shadow-lg hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-4 focus:ring-offset-2 ${
                      tier.popular
                        ? 'bg-gradient-to-r from-button-gradient-start to-button-gradient-end hover:from-button-gradient-start-hover hover:to-button-gradient-end-hover focus:from-button-gradient-start-hover focus:to-button-gradient-end-hover text-white focus:ring-blue-500/30'
                        : 'bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 focus:from-gray-700 focus:to-gray-800 text-white focus:ring-gray-500/30'
                        : 'bg-gradient-to-r from-cool-dark-1 to-cool-dark-2 hover:from-cool-dark-2 hover:to-cool-dark-3 focus:from-cool-dark-2 focus:to-cool-dark-3 text-white focus:ring-cool-teal-2/30'
                    }`}
                    aria-label={`Choose ${tier.name} plan - Navigate to contact form`}
                  >
                    {tier.ctaText}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Information */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="bg-cool-dark-2 rounded-2xl p-8 max-w-4xl mx-auto border border-cool-dark-3">
            <h3 className="text-2xl font-bold text-white mb-4 font-montserrat">
              Need Something Custom?
            </h3>
            <p className="text-gray-300 mb-6 leading-relaxed font-poppins">
              Need something different? We create custom solutions for unique business needs. 
              Contact us to discuss your specific requirements and get a personalized quote.
            </p>
            <button
              onClick={scrollToContact}
              onKeyDown={handleKeyDown}
              className="bg-gradient-to-r from-button-gradient-start to-button-gradient-end hover:from-button-gradient-start-hover hover:to-button-gradient-end-hover focus:from-button-gradient-start-hover focus:to-button-gradient-end-hover text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 focus:scale-105 shadow-lg hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:ring-offset-2"
              aria-label="Discuss custom pricing - Navigate to contact form"
            >
              Discuss Custom Pricing
            </button>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}