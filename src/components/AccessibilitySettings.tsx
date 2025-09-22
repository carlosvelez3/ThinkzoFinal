import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Type, Eye, Contrast, Volume2 } from 'lucide-react';

interface AccessibilitySettings {
  fontSize: 'normal' | 'large' | 'extra-large';
  contrast: 'normal' | 'high';
  dyslexiaFont: boolean;
  reducedMotion: boolean;
  textSpacing: 'normal' | 'wide' | 'extra-wide';
}

export function AccessibilityPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>({
    fontSize: 'normal',
    contrast: 'normal',
    dyslexiaFont: false,
    reducedMotion: false,
    textSpacing: 'normal'
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibility-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Apply settings to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Font size
    root.classList.remove('text-normal', 'text-large', 'text-extra-large');
    root.classList.add(`text-${settings.fontSize}`);
    
    // Contrast
    root.classList.remove('contrast-normal', 'contrast-high');
    root.classList.add(`contrast-${settings.contrast}`);
    
    // Dyslexia font
    if (settings.dyslexiaFont) {
      root.classList.add('dyslexia-friendly');
    } else {
      root.classList.remove('dyslexia-friendly');
    }
    
    // Reduced motion
    if (settings.reducedMotion) {
      root.style.setProperty('--animation-duration', '0.01ms');
      root.style.setProperty('--transition-duration', '0.01ms');
    } else {
      root.style.removeProperty('--animation-duration');
      root.style.removeProperty('--transition-duration');
    }
    
    // Text spacing
    root.classList.remove('text-spacing-normal', 'text-spacing-wide', 'text-spacing-extra-wide');
    root.classList.add(`text-spacing-${settings.textSpacing.replace('-', '-')}`);
    
    // Save to localStorage
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
  }, [settings]);

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    const defaultSettings: AccessibilitySettings = {
      fontSize: 'normal',
      contrast: 'normal',
      dyslexiaFont: false,
      reducedMotion: false,
      textSpacing: 'normal'
    };
    setSettings(defaultSettings);
    localStorage.removeItem('accessibility-settings');
  };

  return (
    <>
      {/* Accessibility Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500/30"
        aria-label="Open accessibility settings"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Settings className="w-6 h-6" />
      </motion.button>

      {/* Accessibility Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl z-50 w-full max-w-md mx-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="accessibility-title"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 id="accessibility-title" className="text-xl font-bold text-gray-900">
                    Accessibility Settings
                  </h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                    aria-label="Close accessibility settings"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Font Size */}
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                      <Type className="w-4 h-4 mr-2" />
                      Font Size
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['normal', 'large', 'extra-large'] as const).map((size) => (
                        <button
                          key={size}
                          onClick={() => updateSetting('fontSize', size)}
                          className={`px-3 py-2 text-sm rounded border transition-colors ${
                            settings.fontSize === size
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {size === 'normal' ? 'Normal' : size === 'large' ? 'Large' : 'Extra Large'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Contrast */}
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                      <Contrast className="w-4 h-4 mr-2" />
                      Contrast
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['normal', 'high'] as const).map((contrast) => (
                        <button
                          key={contrast}
                          onClick={() => updateSetting('contrast', contrast)}
                          className={`px-3 py-2 text-sm rounded border transition-colors ${
                            settings.contrast === contrast
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {contrast === 'normal' ? 'Normal' : 'High Contrast'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Text Spacing */}
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                      <Eye className="w-4 h-4 mr-2" />
                      Text Spacing
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['normal', 'wide', 'extra-wide'] as const).map((spacing) => (
                        <button
                          key={spacing}
                          onClick={() => updateSetting('textSpacing', spacing)}
                          className={`px-3 py-2 text-sm rounded border transition-colors ${
                            settings.textSpacing === spacing
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {spacing === 'normal' ? 'Normal' : spacing === 'wide' ? 'Wide' : 'Extra Wide'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Toggle Options */}
                  <div className="space-y-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.dyslexiaFont}
                        onChange={(e) => updateSetting('dyslexiaFont', e.target.checked)}
                        className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">Dyslexia-friendly font</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.reducedMotion}
                        onChange={(e) => updateSetting('reducedMotion', e.target.checked)}
                        className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">Reduce motion</span>
                    </label>
                  </div>

                  {/* Reset Button */}
                  <button
                    onClick={resetSettings}
                    className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Reset to Defaults
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// CSS classes for different settings (add to your CSS file)
export const accessibilityCSS = `
/* Font Size Settings */
.text-normal { font-size: 1rem; }
.text-large { font-size: 1.125rem; }
.text-extra-large { font-size: 1.25rem; }

.text-normal h1 { font-size: 3rem; }
.text-large h1 { font-size: 3.5rem; }
.text-extra-large h1 { font-size: 4rem; }

.text-normal h2 { font-size: 2.25rem; }
.text-large h2 { font-size: 2.75rem; }
.text-extra-large h2 { font-size: 3.25rem; }

/* High Contrast Settings */
.contrast-high {
  --color-text-primary: #000000;
  --color-text-secondary: #000000;
  --color-bg-primary: #ffffff;
  --color-accent: #0000ff;
}

.contrast-high a {
  color: #0000ff !important;
  text-decoration: underline !important;
  text-decoration-thickness: 2px !important;
}

.contrast-high button {
  border: 2px solid currentColor !important;
}

/* Text Spacing Settings */
.text-spacing-normal {
  letter-spacing: 0.01em;
  word-spacing: 0;
}

.text-spacing-wide {
  letter-spacing: 0.05em;
  word-spacing: 0.1em;
}

.text-spacing-extra-wide {
  letter-spacing: 0.12em;
  word-spacing: 0.16em;
}

/* Dyslexia-friendly font */
.dyslexia-friendly {
  font-family: 'OpenDyslexic', Arial, Verdana, sans-serif !important;
}

.dyslexia-friendly * {
  font-family: inherit !important;
}
`;