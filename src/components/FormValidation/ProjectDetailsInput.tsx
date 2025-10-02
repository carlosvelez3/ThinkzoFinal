import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  ChevronDown,
  ChevronUp,
  X,
  Plus,
  Clock,
  DollarSign,
  Target,
  Users,
  Sparkles,
  FileText,
  Zap,
  CheckCircle2,
  Circle,
  Info
} from 'lucide-react';

export interface ProjectDetails {
  projectGoals: string;
  targetAudience: string;
  selectedFeatures: string[];
  timeline: string;
  budgetRange: string;
  additionalNotes: string;
  templateUsed?: string;
}

interface ProjectTemplate {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  suggestedFeatures: string[];
  suggestedGoals: string;
  timeline: string;
  budgetRange: string;
}

interface FeatureCategory {
  name: string;
  icon: React.ReactNode;
  features: string[];
}

interface ProjectDetailsInputProps {
  value: ProjectDetails;
  onChange: (value: ProjectDetails) => void;
  onValidationChange?: (isValid: boolean) => void;
  projectType?: string;
}

const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: 'landing-page',
    name: 'Landing Page',
    icon: <Target className="w-5 h-5" />,
    description: 'High-converting single page to capture leads',
    suggestedFeatures: ['Responsive Design', 'Contact Form', 'Analytics Integration', 'SEO Optimization'],
    suggestedGoals: 'Create a high-converting landing page to capture leads and showcase our product/service',
    timeline: '1-2 weeks',
    budgetRange: '$495-$800'
  },
  {
    id: 'business-website',
    name: 'Business Website',
    icon: <FileText className="w-5 h-5" />,
    description: 'Professional multi-page website',
    suggestedFeatures: ['Responsive Design', 'CMS Integration', 'Contact Form', 'Blog', 'SEO Optimization', 'Analytics Integration'],
    suggestedGoals: 'Build a professional website that establishes credibility and provides information about our business',
    timeline: '2-4 weeks',
    budgetRange: '$800-$1,500'
  },
  {
    id: 'ecommerce',
    name: 'E-commerce Store',
    icon: <DollarSign className="w-5 h-5" />,
    description: 'Full online store with payments',
    suggestedFeatures: ['Product Catalog', 'Shopping Cart', 'Payment Processing', 'User Accounts', 'Order Management', 'Inventory System', 'Admin Dashboard'],
    suggestedGoals: 'Launch an online store to sell products with secure payment processing and inventory management',
    timeline: '4-8 weeks',
    budgetRange: '$1,500-$3,500'
  },
  {
    id: 'web-app',
    name: 'Web Application',
    icon: <Zap className="w-5 h-5" />,
    description: 'Custom interactive application',
    suggestedFeatures: ['User Authentication', 'Database Integration', 'API Development', 'Admin Dashboard', 'Real-time Features', 'User Accounts'],
    suggestedGoals: 'Develop a custom web application that solves specific business problems with interactive features',
    timeline: '6-12 weeks',
    budgetRange: '$3,500+'
  },
  {
    id: 'ai-integration',
    name: 'AI Integration',
    icon: <Sparkles className="w-5 h-5" />,
    description: 'AI-powered features and automation',
    suggestedFeatures: ['AI/ML Integration', 'Natural Language Processing', 'Automated Workflows', 'API Development', 'Data Analytics'],
    suggestedGoals: 'Integrate AI capabilities to automate processes and enhance user experience',
    timeline: '4-10 weeks',
    budgetRange: '$2,000+'
  }
];

const FEATURE_CATEGORIES: FeatureCategory[] = [
  {
    name: 'Frontend',
    icon: <FileText className="w-4 h-4" />,
    features: ['Responsive Design', 'Custom UI/UX', 'Animations', 'Interactive Elements', 'Mobile-First Design']
  },
  {
    name: 'Backend',
    icon: <Zap className="w-4 h-4" />,
    features: ['Database Integration', 'API Development', 'User Authentication', 'User Accounts', 'Admin Dashboard']
  },
  {
    name: 'E-commerce',
    icon: <DollarSign className="w-4 h-4" />,
    features: ['Product Catalog', 'Shopping Cart', 'Payment Processing', 'Order Management', 'Inventory System']
  },
  {
    name: 'Content',
    icon: <FileText className="w-4 h-4" />,
    features: ['CMS Integration', 'Blog', 'Content Management', 'Multi-language Support']
  },
  {
    name: 'Integration',
    icon: <Sparkles className="w-4 h-4" />,
    features: ['AI/ML Integration', 'Third-party APIs', 'Analytics Integration', 'Email Integration', 'Social Media Integration']
  },
  {
    name: 'Optimization',
    icon: <Target className="w-4 h-4" />,
    features: ['SEO Optimization', 'Performance Optimization', 'Security Features', 'Real-time Features', 'Automated Workflows']
  }
];

const TIMELINE_OPTIONS = [
  { value: 'asap', label: 'ASAP (1-2 weeks)', icon: <Zap className="w-4 h-4" /> },
  { value: '2-4-weeks', label: '2-4 weeks', icon: <Clock className="w-4 h-4" /> },
  { value: '1-2-months', label: '1-2 months', icon: <Clock className="w-4 h-4" /> },
  { value: '2-3-months', label: '2-3 months', icon: <Clock className="w-4 h-4" /> },
  { value: 'flexible', label: 'Flexible timeline', icon: <Clock className="w-4 h-4" /> }
];

const BUDGET_RANGES = [
  { value: 'under-1k', label: 'Under $1,000', range: [0, 1000] },
  { value: '1k-3k', label: '$1,000 - $3,000', range: [1000, 3000] },
  { value: '3k-5k', label: '$3,000 - $5,000', range: [3000, 5000] },
  { value: '5k-10k', label: '$5,000 - $10,000', range: [5000, 10000] },
  { value: '10k-plus', label: '$10,000+', range: [10000, 100000] }
];

export function ProjectDetailsInput({
  value,
  onChange,
  onValidationChange,
  projectType
}: ProjectDetailsInputProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['templates', 'goals']));
  const [customFeature, setCustomFeature] = useState('');
  const [showAllFeatures, setShowAllFeatures] = useState(false);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const handleTemplateSelect = (template: ProjectTemplate) => {
    onChange({
      ...value,
      projectGoals: template.suggestedGoals,
      selectedFeatures: template.suggestedFeatures,
      timeline: template.timeline,
      budgetRange: template.budgetRange,
      templateUsed: template.id
    });
    setExpandedSections(new Set(['goals', 'features', 'timeline', 'budget']));
  };

  const handleFeatureToggle = (feature: string) => {
    const newFeatures = value.selectedFeatures.includes(feature)
      ? value.selectedFeatures.filter(f => f !== feature)
      : [...value.selectedFeatures, feature];
    onChange({ ...value, selectedFeatures: newFeatures });
  };

  const handleAddCustomFeature = () => {
    if (customFeature.trim() && !value.selectedFeatures.includes(customFeature.trim())) {
      onChange({
        ...value,
        selectedFeatures: [...value.selectedFeatures, customFeature.trim()]
      });
      setCustomFeature('');
    }
  };

  const handleRemoveFeature = (feature: string) => {
    onChange({
      ...value,
      selectedFeatures: value.selectedFeatures.filter(f => f !== feature)
    });
  };

  useEffect(() => {
    const isValid =
      value.projectGoals.trim().length >= 20 &&
      value.selectedFeatures.length > 0 &&
      value.timeline.trim().length > 0 &&
      value.budgetRange.trim().length > 0;

    if (onValidationChange) {
      onValidationChange(isValid);
    }
  }, [value, onValidationChange]);

  const completionPercentage = (() => {
    let completed = 0;
    const total = 5;

    if (value.projectGoals.trim().length >= 20) completed++;
    if (value.targetAudience.trim().length > 0) completed++;
    if (value.selectedFeatures.length > 0) completed++;
    if (value.timeline.trim().length > 0) completed++;
    if (value.budgetRange.trim().length > 0) completed++;

    return Math.round((completed / total) * 100);
  })();

  const relevantTemplates = projectType
    ? PROJECT_TEMPLATES.filter(t => t.id === projectType)
    : PROJECT_TEMPLATES;

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-white">Project Details Completion</span>
          <span className="text-sm font-bold text-primary-accent">{completionPercentage}%</span>
        </div>
        <div className="w-full bg-gray-600 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-cta-yellow to-primary-accent h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Complete all sections for the best results
        </p>
      </div>

      {/* Project Templates */}
      {relevantTemplates.length > 0 && (
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => toggleSection('templates')}
            className="w-full flex items-center justify-between text-left group"
          >
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-primary-accent" />
              <h4 className="text-lg font-bold text-white">Quick Start Templates</h4>
            </div>
            {expandedSections.has('templates') ? (
              <ChevronUp className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
            )}
          </button>

          <AnimatePresence>
            {expandedSections.has('templates') && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  {relevantTemplates.map((template) => (
                    <motion.button
                      key={template.id}
                      type="button"
                      onClick={() => handleTemplateSelect(template)}
                      className={`p-4 rounded-lg border-2 text-left transition-all duration-300 ${
                        value.templateUsed === template.id
                          ? 'border-primary-accent bg-primary-accent/10'
                          : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="text-primary-accent mt-1">{template.icon}</div>
                        <div className="flex-1">
                          <h5 className="font-semibold text-white mb-1">{template.name}</h5>
                          <p className="text-xs text-gray-400 mb-2">{template.description}</p>
                          <div className="flex items-center space-x-3 text-xs text-gray-400">
                            <span className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{template.timeline}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <DollarSign className="w-3 h-3" />
                              <span>{template.budgetRange}</span>
                            </span>
                          </div>
                        </div>
                        {value.templateUsed === template.id && (
                          <CheckCircle2 className="w-5 h-5 text-primary-accent flex-shrink-0" />
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Project Goals */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => toggleSection('goals')}
          className="w-full flex items-center justify-between text-left group"
        >
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-primary-accent" />
            <h4 className="text-lg font-bold text-white">
              Project Goals <span className="text-red-400">*</span>
            </h4>
            {value.projectGoals.trim().length >= 20 && (
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            )}
          </div>
          {expandedSections.has('goals') ? (
            <ChevronUp className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
          )}
        </button>

        <AnimatePresence>
          {expandedSections.has('goals') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden space-y-2"
            >
              <textarea
                value={value.projectGoals}
                onChange={(e) => onChange({ ...value, projectGoals: e.target.value })}
                placeholder="What are your main goals for this project? What problem are you trying to solve?"
                rows={4}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-accent/20 focus:border-primary-accent transition-all duration-200 resize-y"
              />
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1 text-gray-400">
                  <Info className="w-3 h-3" />
                  <span>Minimum 20 characters</span>
                </div>
                <span className={`${value.projectGoals.length > 500 ? 'text-orange-400' : 'text-gray-400'}`}>
                  {value.projectGoals.length}/1000
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Target Audience */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => toggleSection('audience')}
          className="w-full flex items-center justify-between text-left group"
        >
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-primary-accent" />
            <h4 className="text-lg font-bold text-white">Target Audience (Optional)</h4>
            {value.targetAudience.trim().length > 0 && (
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            )}
          </div>
          {expandedSections.has('audience') ? (
            <ChevronUp className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
          )}
        </button>

        <AnimatePresence>
          {expandedSections.has('audience') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <textarea
                value={value.targetAudience}
                onChange={(e) => onChange({ ...value, targetAudience: e.target.value })}
                placeholder="Who will use this project? (e.g., small business owners, tech-savvy millennials, enterprise clients)"
                rows={3}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-accent/20 focus:border-primary-accent transition-all duration-200 resize-y"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Features */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => toggleSection('features')}
          className="w-full flex items-center justify-between text-left group"
        >
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-primary-accent" />
            <h4 className="text-lg font-bold text-white">
              Desired Features <span className="text-red-400">*</span>
            </h4>
            {value.selectedFeatures.length > 0 && (
              <span className="text-sm text-gray-400">({value.selectedFeatures.length} selected)</span>
            )}
          </div>
          {expandedSections.has('features') ? (
            <ChevronUp className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
          )}
        </button>

        <AnimatePresence>
          {expandedSections.has('features') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden space-y-4"
            >
              {/* Selected Features Tags */}
              {value.selectedFeatures.length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 bg-gray-700/50 rounded-lg border border-gray-600">
                  {value.selectedFeatures.map((feature) => (
                    <motion.span
                      key={feature}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="inline-flex items-center space-x-1 px-3 py-1 bg-primary-accent/20 text-primary-accent rounded-full text-sm font-medium border border-primary-accent/30"
                    >
                      <span>{feature}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(feature)}
                        className="hover:text-white transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </motion.span>
                  ))}
                </div>
              )}

              {/* Feature Categories */}
              <div className="space-y-3">
                {FEATURE_CATEGORIES.slice(0, showAllFeatures ? undefined : 3).map((category) => (
                  <div key={category.name} className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm font-semibold text-gray-300">
                      {category.icon}
                      <span>{category.name}</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {category.features.map((feature) => {
                        const isSelected = value.selectedFeatures.includes(feature);
                        return (
                          <button
                            key={feature}
                            type="button"
                            onClick={() => handleFeatureToggle(feature)}
                            className={`px-3 py-2 rounded-lg text-sm transition-all duration-200 text-left ${
                              isSelected
                                ? 'bg-primary-accent/20 text-primary-accent border-2 border-primary-accent'
                                : 'bg-gray-700 text-gray-300 border-2 border-gray-600 hover:border-gray-500'
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              {isSelected ? (
                                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                              ) : (
                                <Circle className="w-4 h-4 flex-shrink-0" />
                              )}
                              <span className="truncate">{feature}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {!showAllFeatures && FEATURE_CATEGORIES.length > 3 && (
                <button
                  type="button"
                  onClick={() => setShowAllFeatures(true)}
                  className="text-sm text-primary-accent hover:text-amber-400 transition-colors font-medium"
                >
                  Show {FEATURE_CATEGORIES.length - 3} more categories
                </button>
              )}

              {/* Custom Feature Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300">Add Custom Feature</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={customFeature}
                    onChange={(e) => setCustomFeature(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomFeature())}
                    placeholder="Enter a custom feature..."
                    className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-accent/20 focus:border-primary-accent transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomFeature}
                    disabled={!customFeature.trim()}
                    className="px-4 py-2 bg-primary-accent text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Add</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Timeline */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => toggleSection('timeline')}
          className="w-full flex items-center justify-between text-left group"
        >
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-primary-accent" />
            <h4 className="text-lg font-bold text-white">
              Timeline <span className="text-red-400">*</span>
            </h4>
            {value.timeline && (
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            )}
          </div>
          {expandedSections.has('timeline') ? (
            <ChevronUp className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
          )}
        </button>

        <AnimatePresence>
          {expandedSections.has('timeline') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {TIMELINE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => onChange({ ...value, timeline: option.label })}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                      value.timeline === option.label
                        ? 'border-primary-accent bg-primary-accent/10 text-white'
                        : 'border-gray-600 bg-gray-700/50 text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      {option.icon}
                      <span className="text-sm font-medium">{option.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Budget Range */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => toggleSection('budget')}
          className="w-full flex items-center justify-between text-left group"
        >
          <div className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-primary-accent" />
            <h4 className="text-lg font-bold text-white">
              Budget Range <span className="text-red-400">*</span>
            </h4>
            {value.budgetRange && (
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            )}
          </div>
          {expandedSections.has('budget') ? (
            <ChevronUp className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
          )}
        </button>

        <AnimatePresence>
          {expandedSections.has('budget') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {BUDGET_RANGES.map((budget) => (
                  <button
                    key={budget.value}
                    type="button"
                    onClick={() => onChange({ ...value, budgetRange: budget.label })}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      value.budgetRange === budget.label
                        ? 'border-primary-accent bg-primary-accent/10 text-white'
                        : 'border-gray-600 bg-gray-700/50 text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{budget.label}</span>
                      {value.budgetRange === budget.label && (
                        <CheckCircle2 className="w-5 h-5 text-primary-accent" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Additional Notes */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => toggleSection('notes')}
          className="w-full flex items-center justify-between text-left group"
        >
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-primary-accent" />
            <h4 className="text-lg font-bold text-white">Additional Notes (Optional)</h4>
          </div>
          {expandedSections.has('notes') ? (
            <ChevronUp className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
          )}
        </button>

        <AnimatePresence>
          {expandedSections.has('notes') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <textarea
                value={value.additionalNotes}
                onChange={(e) => onChange({ ...value, additionalNotes: e.target.value })}
                placeholder="Any other details, specific requirements, or questions you'd like to share..."
                rows={4}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-accent/20 focus:border-primary-accent transition-all duration-200 resize-y"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
