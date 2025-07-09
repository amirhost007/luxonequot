import React, { createContext, useContext, useState, ReactNode } from 'react';
import { QuotationData } from '../types';
import { AdminSettings, FormField, PDFTemplate } from '../types/admin';

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
  updateFormField: (field: FormField) => void;
  deleteFormField: (fieldId: string) => void;
  addFormField: (field: FormField) => void;
  updatePdfTemplate: (template: PDFTemplate) => void;
  deletePdfTemplate: (templateId: string) => void;
  addPdfTemplate: (template: PDFTemplate) => void;
}

const defaultFormFields: FormField[] = [
  {
    id: 'serviceLevel',
    type: 'radio',
    label: 'Scope of Work',
    required: true,
    options: ['Fabrication Only', 'Fabrication & Delivery', 'Fabrication, Delivery & Installation'],
    step: 1,
    category: 'Service',
    order: 1,
    visible: true
  },
  {
    id: 'materialSource',
    type: 'radio',
    label: 'Material Source',
    required: true,
    options: ['By Luxone Own Material', 'By Yourself', 'Luxone Others'],
    step: 2,
    category: 'Material',
    order: 2,
    visible: true
  },
  {
    id: 'worktopLayout',
    type: 'radio',
    label: 'Worktop Layout',
    required: true,
    options: ['U + Island', 'U Shape', 'L + Island', 'L Shape', 'Galley', '1 Piece', 'Custom'],
    step: 3,
    category: 'Layout',
    order: 3,
    visible: true
  },
  {
    id: 'timeline',
    type: 'radio',
    label: 'Project Timeline',
    required: true,
    options: ['ASAP to 2 Weeks', '3 to 6 Weeks', '6 Weeks or more'],
    step: 6,
    category: 'Timeline',
    order: 6,
    visible: true
  },
  {
    id: 'projectType',
    type: 'select',
    label: 'Project Type & Application',
    required: true,
    options: [
      'Kitchen - Ready for worktops now / ASAP',
      'Kitchen - Under renovation',
      'Kitchen - Planning stage',
      'Bathroom - Ready for worktops now / ASAP',
      'Bathroom - Under renovation',
      'Bathroom - Planning stage',
      'Commercial - Office space',
      'Commercial - Restaurant/Hotel',
      'Commercial - Retail',
      'Residential - New construction',
      'Residential - Renovation',
      'Other - Please specify in comments'
    ],
    step: 8,
    category: 'Project',
    order: 8,
    visible: true
  },
  {
    id: 'name',
    type: 'text',
    label: 'Your Name',
    placeholder: 'First name / Surname',
    required: true,
    step: 9,
    category: 'Contact',
    order: 9,
    visible: true
  },
  {
    id: 'email',
    type: 'text',
    label: 'Email Address',
    placeholder: 'your.email@example.com',
    required: true,
    step: 9,
    category: 'Contact',
    order: 10,
    visible: true
  },
  {
    id: 'contactNumber',
    type: 'text',
    label: 'Contact Number',
    placeholder: '01234 567890',
    required: true,
    step: 9,
    category: 'Contact',
    order: 11,
    visible: true
  },
  {
    id: 'location',
    type: 'select',
    label: 'Location',
    required: true,
    options: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah'],
    step: 9,
    category: 'Contact',
    order: 12,
    visible: true
  }
];

const defaultPdfTemplate: PDFTemplate = {
  id: 'default',
  name: 'Default Template',
  headerLogo: 'https://demo.theluxone.com/wp-content/uploads/2025/06/cropped-Luxone_HQ-1.png',
  headerText: 'Luxone - Premium Worktop Solutions',
  footerText: '© 2025 Luxone - Premium Worktop Solutions | UAE | www.theluxone.com',
  colors: {
    primary: '#3B82F6',
    secondary: '#8B5CF6',
    accent: '#F59E0B'
  },
  fonts: {
    heading: 'Arial, sans-serif',
    body: 'Arial, sans-serif'
  },
  sections: {
    showClientInfo: true,
    showProjectSpecs: true,
    showPricing: true,
    showTerms: true,
    customSections: []
  },
  layout: 'standard'
};

const defaultSettings: AdminSettings = {
  companyName: 'Luxone',
  website: 'www.theluxone.com',
  address: 'Dubai, UAE\nPremium Worktop Solutions',
  whatsappIndia: '+919648555355',
  whatsappUAE: '+971585815601',
  adminEmail: 'amirhost07@gmail.com',
  pricePerSqft: 150,
  aedToUsdRate: 3.67,
  vatRate: 5,
  consultantName: 'Ahmed Al-Rashid',
  consultantPhone: '+971501234567',
  consultantEmail: 'ahmed@theluxone.com',
  formFields: defaultFormFields,
  pdfTemplates: [defaultPdfTemplate],
  activePdfTemplate: 'default'
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

  const updateFormField = (field: FormField) => {
    setSettings(prev => ({
      ...prev,
      formFields: prev.formFields.map(f => f.id === field.id ? field : f)
    }));
  };

  const deleteFormField = (fieldId: string) => {
    setSettings(prev => ({
      ...prev,
      formFields: prev.formFields.filter(f => f.id !== fieldId)
    }));
  };

  const addFormField = (field: FormField) => {
    setSettings(prev => ({
      ...prev,
      formFields: [...prev.formFields, field]
    }));
  };

  const updatePdfTemplate = (template: PDFTemplate) => {
    setSettings(prev => ({
      ...prev,
      pdfTemplates: prev.pdfTemplates.map(t => t.id === template.id ? template : t)
    }));
  };

  const deletePdfTemplate = (templateId: string) => {
    setSettings(prev => ({
      ...prev,
      pdfTemplates: prev.pdfTemplates.filter(t => t.id !== templateId)
    }));
  };

  const addPdfTemplate = (template: PDFTemplate) => {
    setSettings(prev => ({
      ...prev,
      pdfTemplates: [...prev.pdfTemplates, template]
    }));
  };

  const value = {
    settings,
    updateSettings,
    quotes,
    addQuote,
    isAdminMode,
    setIsAdminMode,
    updateFormField,
    deleteFormField,
    addFormField,
    updatePdfTemplate,
    deletePdfTemplate,
    addPdfTemplate
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