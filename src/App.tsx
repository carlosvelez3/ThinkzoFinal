import { useState, useCallback } from 'react';
import { Toaster } from 'react-hot-toast';
import { Header } from './components/Header';
import { EnhancedHeroSection } from './components/EnhancedHeroSection';
import { ServicesSection } from './components/ServicesSection';
import { ProcessSection } from './components/ProcessSection';
import { PricingSection } from './components/PricingSection';
import { Modal } from './components/Modal';
import { ContactForm } from './components/ContactForm';
import { Footer } from './components/Footer';
import { ThreeDScene } from './components/ThreeDScene';
import { AccessibilityPanel } from './components/AccessibilitySettings';
import { ErrorBoundary } from './components/ErrorBoundary';
import { OfflineIndicator } from './components/OfflineIndicator';
import { ReadingProgressIndicator } from './components/ReadingProgressIndicator';
import { ScrollToTopButton } from './components/ScrollToTopButton';
import { useRecaptchaV3 } from './hooks/useRecaptchaV3';

function App() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  
  // Initialize reCAPTCHA v3 globally
  const { isReady: recaptchaReady, error: recaptchaError } = useRecaptchaV3();

  // Show error if reCAPTCHA fails to load
  if (recaptchaError) {
    console.error('reCAPTCHA failed to load:', recaptchaError);
  }

  const openContactModal = useCallback(() => setIsContactModalOpen(true), []);
  const closeContactModal = useCallback(() => setIsContactModalOpen(false), []);

  const skipToMain = useCallback(() => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <ErrorBoundary>
      <div className="relative min-h-screen">
        {/* Skip to main content link for keyboard users */}
        <a 
          href="#main-content" 
          className="skip-link"
          onClick={(e) => {
            e.preventDefault();
            skipToMain();
          }}
        >
          Skip to main content
        </a>

        {/* Global 3D Background */}
        <div className="fixed inset-0 z-0">
          <ThreeDScene />
        </div>

        {/* Reading Progress Indicator */}
        <ReadingProgressIndicator />

        {/* Main Content */}
        <div className="relative h-full">
          <Header onOpenContactModal={openContactModal} />
          <main id="main-content" tabIndex={-1} role="main" className="h-full">
            <EnhancedHeroSection onOpenContactModal={openContactModal} />
            <ServicesSection onOpenContactModal={openContactModal} />
            <ProcessSection onOpenContactModal={openContactModal} />
            <PricingSection onOpenContactModal={openContactModal} />
          </main>
          <Footer onOpenContactModal={openContactModal} />
        </div>

        {/* Contact Modal */}
        <Modal
          isOpen={isContactModalOpen}
          onClose={closeContactModal}
          title="Start Your AI Project"
          maxWidth="max-w-4xl"
        >
          <ContactForm onCloseModal={closeContactModal} />
        </Modal>
        
        {/* Global Components */}
        <OfflineIndicator />
        <AccessibilityPanel />
        <ScrollToTopButton />
        
        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#374151',
              color: '#fff',
              borderRadius: '8px',
              fontSize: '14px',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
          containerStyle={{
            zIndex: 9999,
          }}
        />
      </div>
    </ErrorBoundary>
  );
}

export default App;
