import React from 'react';
import { Toaster } from 'react-hot-toast';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ServicesSection } from './components/ServicesSection';
import { ProcessSection } from './components/ProcessSection';
import { PricingSection } from './components/PricingSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ThreeDScene } from './components/ThreeDScene';
import { AccessibilityPanel } from './components/AccessibilitySettings';
import { ErrorBoundary } from './components/ErrorBoundary';
import { OfflineIndicator } from './components/OfflineIndicator';

function App() {
  const skipToMain = () => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <ErrorBoundary>
      <div className="relative">
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

        {/* Main Content */}
        <div className="relative">
          <Header />
          <main id="main-content" tabIndex={-1} role="main">
            <HeroSection />
          </main>
          <ServicesSection />
          <ProcessSection />
          <PricingSection />
          <ContactSection />
          <Footer />
        </div>
        
        {/* Global Components */}
        <OfflineIndicator />
        <AccessibilityPanel />
        
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
        />
      </div>
    </ErrorBoundary>
  );
}

export default App;
