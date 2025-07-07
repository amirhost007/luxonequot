import { QuotationData } from '../types';

export interface PricingBreakdown {
  materialCost: number;
  cutting: number;
  topPolishing: number;
  polishing: number;
  installation: number;
  customEdge: number;
  sinkCutOut: number;
  hobCutOut: number;
  underMountedSink: number;
  drainGrooves: number;
  tapHoles: number;
  steelFrame: number;
  delivery: number;
  subtotal: number;
  margin: number;
  subtotalWithMargin: number;
  vat: number;
  grandTotal: number;
  totalSqm: number;
  slabsRequired: number;
}

export const calculatePricing = (data: QuotationData, pricePerSqft: number = 150): PricingBreakdown => {
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
  
  // Material cost calculation
  let materialCost = 0;
  if (data.materialSource === 'luxone') {
    // For Luxone material, use slabs * price per sqft * slab size
    materialCost = slabsRequired * pricePerSqft * slabSize;
  } else if (data.materialSource === 'luxone-others') {
    // For Luxone others, use client provided pricing
    const requiredSlabs = parseInt(data.requiredSlabs || '0');
    const pricePerSlab = parseFloat(data.pricePerSlab?.replace(/[^\d.]/g, '') || '0');
    materialCost = requiredSlabs * pricePerSlab;
  }
  // For 'yourself' option, material cost is 0
  
  // Base costs
  const cutting = totalSqm * 20;
  const topPolishing = totalSqm * 50;
  const polishing = totalSqm * 30;
  const installation = totalSqm * 2 * 70; // multiply by 2 as specified
  
  // Additional features
  const customEdge = data.customEdge === 'YES' ? 120 : 0;
  const sinkCutOut = (data.sinkCutOut || 0) * 40;
  const hobCutOut = (data.hobCutOut || 0) * 40;
  const underMountedSink = data.underMountedSink === 'YES' ? 340 : 0;
  const drainGrooves = parseInt(data.drainGrooves || '0') * 250;
  const tapHoles = parseInt(data.tapHoles || '0') * 35;
  const steelFrame = data.steelFrame === 'YES' ? 300 : 0;
  
  // Delivery cost based on location
  let delivery = 0;
  if (data.location === 'Dubai') {
    delivery = 500;
  } else if (data.location && data.location !== '') {
    delivery = 800;
  }
  
  // Calculate subtotal
  const subtotal = materialCost + cutting + topPolishing + polishing + installation + 
                  customEdge + sinkCutOut + hobCutOut + underMountedSink + 
                  drainGrooves + tapHoles + steelFrame + delivery;
  
  // Add 20% margin
  const margin = subtotal * 0.20;
  const subtotalWithMargin = subtotal + margin;
  
  // Add 5% VAT
  const vat = subtotalWithMargin * 0.05;
  const grandTotal = subtotalWithMargin + vat;
  
  return {
    materialCost,
    cutting,
    topPolishing,
    polishing,
    installation,
    customEdge,
    sinkCutOut,
    hobCutOut,
    underMountedSink,
    drainGrooves,
    tapHoles,
    steelFrame,
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