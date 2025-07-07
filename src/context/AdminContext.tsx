import React, { createContext, useContext, useState, ReactNode } from 'react';
import { QuotationData } from '../types';

interface AdminSettings {
  companyName: string;
  website: string;
  address: string;
  whatsappIndia: string;
  whatsappUAE: string;
  adminEmail: string;
  pricePerSqft: number;
  aedToUsdRate: number;
  vatRate: number;
  consultantName: string;
  consultantPhone: string;
  consultantEmail: string;
}

interface QuoteRecord {
  id: string;
  data: QuotationData;
  createdAt: string;
}

interface AdminContextType {
  settings: AdminSettings;
  updateSettings: (newSettings: AdminSettings) => void;
  quotes: QuoteRecord[];
  addQuote: (quote: QuoteRecord) => void;
  isAdminMode: boolean;
  setIsAdminMode: (mode: boolean) => void;
}

const defaultSettings: AdminSettings = {
  companyName: 'Luxone',
  website: 'www.theluxone.com',
  address: 'Dubai, UAE\nPremium Worktop Solutions',
  whatsappIndia: '+919648555355',
  whatsappUAE: '+971585815601',
  adminEmail: 'admin@theluxone.com',
  pricePerSqft: 150,
  aedToUsdRate: 3.67,
  vatRate: 5,
  consultantName: 'Ahmed Al-Rashid',
  consultantPhone: '+971501234567',
  consultantEmail: 'ahmed@theluxone.com'
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AdminSettings>(defaultSettings);
  const [quotes, setQuotes] = useState<QuoteRecord[]>([]);
  const [isAdminMode, setIsAdminMode] = useState(false);

  const updateSettings = (newSettings: AdminSettings) => {
    setSettings(newSettings);
  };

  const addQuote = (quote: QuoteRecord) => {
    setQuotes(prev => [quote, ...prev]);
  };

  const value = {
    settings,
    updateSettings,
    quotes,
    addQuote,
    isAdminMode,
    setIsAdminMode
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};