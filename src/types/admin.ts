export interface FormField {
  id: string;
  type: 'text' | 'select' | 'number' | 'textarea' | 'checkbox' | 'radio' | 'file';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
  step?: number;
  category?: string;
  order: number;
  visible: boolean;
}

export interface PDFTemplate {
  id: string;
  name: string;
  headerLogo: string;
  headerText: string;
  footerText: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  sections: {
    showClientInfo: boolean;
    showProjectSpecs: boolean;
    showPricing: boolean;
    showTerms: boolean;
    customSections: Array<{
      title: string;
      content: string;
      order: number;
    }>;
  };
  layout: 'standard' | 'modern' | 'minimal';
}

export interface AdminSettings {
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
  formFields: FormField[];
  pdfTemplates: PDFTemplate[];
  activePdfTemplate: string;
  costRules?: CostRule[];
}
export interface CostRule {
  id: string;
  name: string;
  category: 'material' | 'fabrication' | 'installation' | 'addon' | 'delivery' | 'business';
  type: 'fixed' | 'per_sqm' | 'per_piece' | 'percentage';
  value: number;
  description: string;
  isActive: boolean;
}
