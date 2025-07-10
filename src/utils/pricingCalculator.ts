import { QuotationData } from '../types';
import { CostRule } from '../types/admin';

export interface PricingBreakdown {
  materialCost: number;
  fabricationCost: number;
  installation: number;
  addonCost: number;
  delivery: number;
  subtotal: number;
  margin: number;
  subtotalWithMargin: number;
  vat: number;
  grandTotal: number;
  totalSqm: number;
  slabsRequired: number;
}

export const calculatePricing = (data: QuotationData, pricePerSqft: number = 150, costRules?: CostRule[]): PricingBreakdown => {
  // Calculate total area from pieces
  const pieces = Object.values(data.pieces).filter(piece => 
    piece && piece.length && piece.width
  );
  
  let totalAreaMm2 = 0;
  if (pieces.length > 0) {
    totalAreaMm2 = pieces.reduce((total, piece) => {
      const length = parseFloat(piece.length) || 0;
      const width = parseFloat(piece.width) || 0;
      return total + (length * width);
    }, 0);
  }
  
  // Convert mm² to m² (1 m² = 1,000,000 mm²)
  const totalSqm = totalAreaMm2 / 1000000;
  
  // Calculate slabs required (each slab is 5.12 m²)
  const slabSize = 5.12;
  const slabsRequired = Math.ceil(totalSqm / slabSize);
  
  // Helper function to get cost rule value
  const getCostRuleValue = (ruleId: string, defaultValue: number): number => {
    if (!costRules) return defaultValue;
    const rule = costRules.find(r => r.id === ruleId && r.isActive);
    return rule ? rule.value : defaultValue;
  };

  // Material cost calculation
  let materialCost = 0;
  if (data.materialSource === 'luxone') {
    // For Luxone material, use cost rules or default
    const materialRate = getCostRuleValue('material_base', pricePerSqft);
    materialCost = totalSqm * materialRate;
  } else if (data.materialSource === 'luxone-others') {
    // For Luxone others, use client provided pricing
    const requiredSlabs = parseInt(data.requiredSlabs || '0');
    const pricePerSlab = parseFloat(data.pricePerSlab?.replace(/[^\d.]/g, '') || '0');
    materialCost = requiredSlabs * pricePerSlab;
  }
  // For 'yourself' option, material cost is 0
  
  // Fabrication costs
  const cutting = totalSqm * getCostRuleValue('cutting', 20);
  const topPolishing = totalSqm * getCostRuleValue('top_polishing', 50);
  const edgePolishing = totalSqm * getCostRuleValue('edge_polishing', 30);
  const fabricationCost = cutting + topPolishing + edgePolishing;
  
  // Installation cost
  const installation = totalSqm * getCostRuleValue('installation', 140);
  
  // Addon costs
  let addonCost = 0;
  if (data.sinkOption === 'luxone-customized') {
    addonCost += getCostRuleValue('sink_luxone', 500);
  }
  
  // Delivery cost based on location
  let delivery = 0;
  if (data.location === 'Dubai') {
    delivery = getCostRuleValue('delivery_dubai', 500);
  } else if (data.location && data.location !== '') {
    delivery = getCostRuleValue('delivery_uae', 800);
  }
  
  // Calculate subtotal
  const subtotal = materialCost + fabricationCost + installation + addonCost + delivery;
  
  // Add margin
  const marginRate = getCostRuleValue('margin', 20) / 100;
  const margin = subtotal * marginRate;
  const subtotalWithMargin = subtotal + margin;
  
  // Add VAT
  const vatRate = getCostRuleValue('vat', 5) / 100;
  const vat = subtotalWithMargin * vatRate;
  const grandTotal = subtotalWithMargin + vat;
  
  return {
    materialCost,
    fabricationCost,
    installation,
    addonCost,
    delivery,
    subtotal,
    margin,
    subtotalWithMargin,
    vat,
    grandTotal,
    totalSqm,
    slabsRequired
  };
};