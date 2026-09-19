import React from 'react';
import { useApp } from '../../context/AppContext';
import { Navbar } from './Navbar';
import { Hero } from './Hero';
import { ProblemSelector } from './ProblemSelector';
import { FloatingHowItWorks } from './FloatingHowItWorks';
import { ServicesSection } from './ServicesSection';
import { WhyOnSiteSection } from './WhyOnSiteSection';
import { WhoWeServeSection } from './WhoWeServeSection';
import { BulkDeploymentSection } from './BulkDeploymentSection';
import { TechnicianSection } from './TechnicianSection';
import { TrustSection } from './TrustSection';
import { RealCasesSection } from './RealCasesSection';
import { ServiceAreaSection } from './ServiceAreaSection';
import { FAQSection } from './FAQSection';
import { ServiceRequestForm } from './ServiceRequestForm';
import { FinalCTA } from './FinalCTA';
import { Footer } from './Footer';
import { FloatingWhatsAppButton } from './FloatingWhatsAppButton';
import { FloatingAdminButton } from './FloatingAdminButton';

export const PublicPage: React.FC = () => {
  const { settings } = useApp();

  if (settings && settings.pagePublished === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070b12] text-white">
        <div className="text-center p-8">
          <h1 className="text-4xl font-bold mb-4">Temporarily Unavailable</h1>
          <p className="text-slate-400">We are currently updating our services. Please check back soon.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 selection:bg-blue-600 selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <ProblemSelector />
        <FloatingHowItWorks />
        <ServicesSection />
        <WhyOnSiteSection />
        <WhoWeServeSection />
        <BulkDeploymentSection />
        <TechnicianSection />
        <TrustSection />
        <RealCasesSection />
        <ServiceAreaSection />
        <FAQSection />
        <ServiceRequestForm />
        <FinalCTA />
      </main>
      <Footer />
      <FloatingWhatsAppButton />
      <FloatingAdminButton />
    </div>
  );
};
