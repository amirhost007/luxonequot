export interface QuotationData {
  // Step 1: Scope of Work
  serviceLevel: 'fabrication' | 'fabrication-delivery' | 'fabrication-delivery-installation' | '';
  
  // Step 2: Material Options
  materialSource: 'luxone' | 'yourself' | 'luxone-others' | '';
  materialType: 'quartz' | 'porcelain' | '';
  materialColor: string;
  
  // For "By Yourself" option
  slabSize?: string;
  thickness?: string;
  finish?: string;
  slabPhoto?: File | null;
  
  // For "Luxone Others" option
  luxoneOthersSlabSize?: string;
  luxoneOthersThickness?: string;
  luxoneOthersFinish?: string;
  requiredSlabs?: string;
  pricePerSlab?: string;
  brandSupplier?: string;
  luxoneOthersColorName?: string;
  
  // Step 3: Worktop Layout
  worktopLayout: 'u-island' | 'u-shape' | 'l-island' | 'l-shape' | 'galley' | '1-piece' | 'custom' | '';
  
  // Step 4: Worktop Sizes
  pieces: {
    [key: string]: {
      length: string;
      width: string;
      thickness: string;
    };
  };
  planSketch?: File | null;
  
  // Step 5: Design Options
  customEdge: 'YES' | 'NO' | '';
  sinkCutOut: 0 | 1 | 2 | '';
  hobCutOut: 0 | 1 | 2 | '';
  underMountedSink: 'YES' | 'NO' | '';
  steelFrame: 'YES' | 'NO' | '';
  cutOuts: string;
  tapHoles: string;
  upstands: string;
  drainGrooves: string;
  
  // Step 6: Timeline
  timeline: 'asap-2weeks' | '3-6weeks' | '6weeks-plus' | '';
  
  // Step 5: Design Options (Sink)
  sinkOption: string;
  
  // Step 7: Project Type
  projectType: string;
  
  // Step 8: Contact Information
  name: string;
  email?: string;
  contactNumber: string;
  location: 'Dubai' | 'Abu Dhabi' | 'Sharjah' | 'Ajman' | 'Umm Al Quwain' | 'Ras Al Khaimah' | 'Fujairah' | '';
  additionalComments: string;
  
  // Designer Information
  designerName?: string;
  designerContact?: string;
  designerEmail?: string;
}

export interface QuotationContextType {
  data: QuotationData;
  updateData: (updates: Partial<QuotationData>) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  totalSteps: number;
  isQuoteSubmitted: boolean;
  quoteId: string;
  submitQuote: () => void;
  resetQuotation: () => void;
}