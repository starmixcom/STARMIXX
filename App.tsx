import React, { useState, useEffect } from 'react';
import { CapturePage } from './pages/CapturePage';
import { SalesPage } from './pages/SalesPage';
import { ThankYouPage } from './pages/ThankYouPage';
import { UserLead, OrderDetails, Step, Variant } from './types';
import { getAbVariant } from './utils/abTesting';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>(Step.CAPTURE);
  const [lead, setLead] = useState<UserLead | null>(null);
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [variant, setVariant] = useState<Variant>('A');

  // Initialisation de l'A/B Testing au chargement
  useEffect(() => {
    setVariant(getAbVariant());
  }, []);

  const handleCaptureComplete = (capturedLead: UserLead) => {
    setLead(capturedLead);
    window.scrollTo(0, 0);
    setCurrentStep(Step.SALES);
  };

  const handleOrderComplete = (orderDetails: OrderDetails) => {
    setOrder(orderDetails);
    window.scrollTo(0, 0);
    setCurrentStep(Step.THANK_YOU);
  };

  return (
    <div className="antialiased text-slate-900">
      {currentStep === Step.CAPTURE && (
        <CapturePage onComplete={handleCaptureComplete} />
      )}
      
      {currentStep === Step.SALES && (
        <SalesPage 
          onOrder={handleOrderComplete} 
          leadName={lead?.name} 
          leadEmail={lead?.email}
          variant={variant}
        />
      )}
      
      {currentStep === Step.THANK_YOU && (
        <ThankYouPage order={order} />
      )}
    </div>
  );
};

export default App;