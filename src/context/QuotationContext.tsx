import React, { createContext, useContext, useState, ReactNode } from 'react';
import { QuotationData, QuotationContextType } from '../types';
import { useAdmin } from './AdminContext';
import { sendAdminNotification } from '../services/emailService';

const initialData: QuotationData = {
  serviceLevel: '',
  materialSource: '',
  materialType: '',
  materialColor: '',
  worktopLayout: '',
  pieces: {},
  customEdge: '',
  sinkCutOut: '',
  hobCutOut: '',
  underMountedSink: '',
  steelFrame: '',
  cutOuts: '',
  tapHoles: '',
  upstands: '',
  drainGrooves: '',
  timeline: '',
  sinkOption: '',
  projectType: '',
  name: '',
  email: '',
  contactNumber: '',
  location: '',
  additionalComments: '',
};

const QuotationContext = createContext<QuotationContextType | undefined>(undefined);

export const QuotationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<QuotationData>(initialData);
  const [currentStep, setCurrentStep] = useState(1);
  const [isQuoteSubmitted, setIsQuoteSubmitted] = useState(false);
  const [quoteId, setQuoteId] = useState('');
  const totalSteps = 9;
  const { addQuote, settings } = useAdmin();

  const updateData = (updates: Partial<QuotationData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const generateQuoteId = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `LUX-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${random}`.toUpperCase();
  };

  const submitQuote = async () => {
    const newQuoteId = generateQuoteId();
    setQuoteId(newQuoteId);
    setIsQuoteSubmitted(true);
    
    // Add to admin quotes
    addQuote({
      id: newQuoteId,
      data: data,
      createdAt: new Date().toISOString()
    });

    // Send automated email notification to admin
    try {
      const emailSent = await sendAdminNotification(data, newQuoteId, settings);
      if (emailSent) {
        console.log('Admin notification email sent successfully');
      } else {
        console.warn('Failed to send admin notification email');
      }
    } catch (error) {
      console.error('Error sending admin notification:', error);
    }
  };

  const resetQuotation = () => {
    setData(initialData);
    setCurrentStep(1);
    setIsQuoteSubmitted(false);
    setQuoteId('');
  };

  const value = {
    data,
    updateData,
    currentStep,
    setCurrentStep,
    totalSteps,
    isQuoteSubmitted,
    quoteId,
    submitQuote,
    resetQuotation,
  };

  return (
    <QuotationContext.Provider value={value}>
      {children}
    </QuotationContext.Provider>
  );
};

export const useQuotation = () => {
  const context = useContext(QuotationContext);
  if (!context) {
    throw new Error('useQuotation must be used within a QuotationProvider');
  }
  return context;
};