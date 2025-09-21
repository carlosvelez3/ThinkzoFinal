import React from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Zap, Crown } from 'lucide-react';

const pricingTiers = [
  {
    id: 'starter',
    name: 'Starter',
    icon: Zap,
    price: '$2,500',
    period: 'one-time',
    description: 'Perfect for small businesses getting started with professional web presence',
    features: [
      'Custom responsive website (up to 5 pages)',
      'Mobile-optimized design',
      'Basic SEO optimization',
      'Contact form integration',
      'Social media integration',
      '3 months of support',
      'Basic analytics setup'
    ],
    popular: false,
    ctaText: 'Get Started',
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'professional',
    name: 'Professional',
    icon: Star,
    price: '$5,500',
    period: 'one-time',
    description: 'Ideal for growing businesses needing advanced features and AI integration',
    features: [
      'Everything in Starter plan',
      'Advanced custom website (up to 10 pages)',
      'AI-powered search functionality',
      'CRM/ERP system integration',
      'E-commerce capabilities',
      'Advanced SEO & performance optimization',
      '6 months of support & maintenance',
      'Custom automation workflows',
      'Analytics & reporting dashboard'
    ],
    popular: true,
    ctaText: 'Most Popular',
    color: 'from-primary-accent to-secondary-purple'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    icon: Crown,
    price: 'Custom',
    period: 'quote',
    description: 'Comprehensive AI-powered solutions for large organizations and complex requirements',
    features: [
      'Everything in Professional plan',
      'Unlimited pages & custom features',
      'Advanced AI & machine learning integration',
      'Multi-system integration (ERP, CRM, inventory)',
      'Custom API development',
      'Advanced security & compliance',
      '12 months of premium support',
      'Dedicated project manager',
      'Custom training & documentation',
      'Priority support & updates'
    ],
    popular: false,
    ctaText: 'Contact Us',
    color: 'from-purple-600 to-indigo-600'
  }
];

export function PricingSection() {
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
      id="pricing" 
      className="relative py-20 px-4 overflow-hidden bg-gradient-to-br from-gray-50 to-white"
      role="region"
      aria-labelledby="pricing-heading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
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
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-dark-primary mb-6 font-retro-mono"
            aria-describedby="pricing-description"
          >
            AI-Powered Web Solutions Pricing
          </h2>
          <p 
            id="pricing-description"
            className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Choose the perfect plan for your business needs. All plans include our cutting-edge AI technology 
            and expert development services.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {pricingTiers.map((tier, index) => {
            const IconComponent = tier.icon;
            return (
              <motion.div
                key={tier.id}
                className={`relative bg-white rounded-2xl shadow-xl border-2 ${
                  tier.popular 
                    ? 'border-primary-accent shadow-2xl transform scale-105' 
                    : 'border-gray-200 hover:border-primary-accent/50'
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

                <div className="p-8">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${tier.color} rounded-full mb-4`}>
                      <IconComponent className="w-8 h-8 text-white" aria-hidden="true" />
                    </div>
                    <h3 className="text-2xl font-bold text-dark-primary mb-2">
                      {tier.name}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {tier.description}
                    </p>
                  </div>

                  {/* Pricing */}
                  <div className="text-center mb-8">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-dark-primary">
                        {tier.price}
                      </span>
                      {tier.period !== 'quote' && (
                        <span className="text-gray-500 ml-2">
                          {tier.period}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-8">
                    <ul className="space-y-3" role="list">
                      {tier.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start" role="listitem">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5 mr-3" aria-hidden="true" />
                          <span className="text-gray-700 text-sm">{feature}</span>
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
                        ? 'bg-gradient-to-r from-primary-accent to-secondary-purple hover:from-primary-accent-hover hover:to-purple-600 focus:from-primary-accent-hover focus:to-purple-600 text-white focus:ring-primary-accent/30'
                        : 'bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 focus:from-gray-700 focus:to-gray-800 text-white focus:ring-gray-500/30'
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
          <div className="bg-blue-50 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-dark-primary mb-4">
              Need Something Custom?
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Every business is unique. If our standard plans don't fit your specific needs, 
              we'll create a custom solution tailored to your requirements and budget.
            </p>
            <button
              onClick={scrollToContact}
              onKeyDown={handleKeyDown}
              className="bg-gradient-to-r from-primary-accent to-secondary-purple hover:from-primary-accent-hover hover:to-purple-600 focus:from-primary-accent-hover focus:to-purple-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 focus:scale-105 shadow-lg hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-4 focus:ring-primary-accent/30 focus:ring-offset-2"
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