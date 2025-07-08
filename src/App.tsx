import React from 'react';
import { QuotationProvider, useQuotation } from './context/QuotationContext';
import { AdminProvider, useAdmin } from './context/AdminContext';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/common/Header';
import Step1ScopeOfWork from './components/steps/Step1ScopeOfWork';
import Step2MaterialOptions from './components/steps/Step2MaterialOptions';
import Step3WorktopLayout from './components/steps/Step3WorktopLayout';
import Step4WorktopSizes from './components/steps/Step4WorktopSizes';
import Step5DesignOptions from './components/steps/Step5DesignOptions';
import Step6Timeline from './components/steps/Step6Timeline';
import Step7SinkOptions from './components/steps/Step7SinkOptions';
import Step8ProjectType from './components/steps/Step8ProjectType';
import Step9ContactInfo from './components/steps/Step9ContactInfo';
import QuoteSummary from './components/QuoteSummary';
import AdminPanel from './components/admin/AdminPanel';
import AdminLogin from './components/admin/AdminLogin';

const AppContent: React.FC = () => {
  const { currentStep, isQuoteSubmitted } = useQuotation();

  if (isQuoteSubmitted) {
    return <QuoteSummary />;
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1ScopeOfWork />;
      case 2:
        return <Step2MaterialOptions />;
      case 3:
        return <Step3WorktopLayout />;
      case 4:
        return <Step4WorktopSizes />;
      case 5:
        return <Step5DesignOptions />;
      case 6:
        return <Step6Timeline />;
      case 7:
        return <Step7SinkOptions />;
      case 8:
        return <Step8ProjectType />;
      case 9:
        return <Step9ContactInfo />;
      default:
        return <Step1ScopeOfWork />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pb-8">
        {renderStep()}
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AdminProvider>
        <QuotationProvider>
          <Routes>
            <Route path="/" element={<AppContent />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminPanel />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </QuotationProvider>
      </AdminProvider>
    </Router>
  );
}

export default App;