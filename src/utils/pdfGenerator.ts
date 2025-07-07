import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { QuotationData } from '../types';
import { calculatePricing } from './pricingCalculator';

const createQuoteHTML = (data: QuotationData, quoteId: string, settings: any): string => {
  const pricing = calculatePricing(data, settings.pricePerSqft);
  
  const getCurrentDateTime = () => {
    return new Date().toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getServiceLevelText = (level: string) => {
    switch (level) {
      case 'fabrication': return 'Fabrication Only';
      case 'fabrication-delivery': return 'Fabrication & Delivery';
      case 'fabrication-delivery-installation': return 'Fabrication, Delivery & Installation';
      default: return level;
    }
  };

  const getMaterialInfo = () => {
    if (data.materialSource === 'luxone') {
      return `${data.materialType === 'quartz' ? 'Luxone Quartz' : 'Luxone Porcelain'} - ${data.materialColor}`;
    } else if (data.materialSource === 'yourself') {
      return `Customer Supplied Material - ${data.slabSize || 'Size TBC'}, ${data.thickness || 'Thickness TBC'}, ${data.finish || 'Finish TBC'}`;
    } else if (data.materialSource === 'luxone-others') {
      return `${data.brandSupplier || 'Brand TBC'} - ${data.luxoneOthersColorName || 'Color TBC'}`;
    }
    return 'Material TBC';
  };

  const getLayoutText = (layout: string) => {
    const layouts = {
      'u-island': 'U Shape + Island',
      'u-shape': 'U Shape',
      'l-island': 'L Shape + Island', 
      'l-shape': 'L Shape',
      'galley': '2 Pieces (Galley)',
      '1-piece': '1 Piece',
      'custom': 'Custom Layout'
    };
    return layouts[layout as keyof typeof layouts] || layout;
  };

  const getTimelineText = (timeline: string) => {
    switch (timeline) {
      case 'asap-2weeks': return 'ASAP to 2 Weeks';
      case '3-6weeks': return '3 to 6 Weeks';  
      case '6weeks-plus': return '6 Weeks or more';
      default: return timeline;
    }
  };

  const getPiecesInfo = () => {
    const pieces = Object.entries(data.pieces).filter(([_, piece]) => 
      piece && piece.length && piece.width && piece.thickness
    );
    
    if (pieces.length === 0) return 'Dimensions to be confirmed';
    
    return pieces.map(([letter, piece]) => 
      `Piece ${letter}: ${piece.length}mm x ${piece.width}mm x ${piece.thickness}mm`
    ).join('<br>');
  };

  const getDesignFeatures = () => {
    const features = [];
    if (data.cutOuts) features.push(`Cut Outs: ${data.cutOuts}`);
    if (data.tapHoles) features.push(`Tap Holes: ${data.tapHoles}`);
    if (data.upstands) features.push(`Upstands: ${data.upstands}`);
    if (data.drainerGrooves) features.push(`Drainer Grooves: ${data.drainerGrooves}`);
    return features.length > 0 ? features.join('<br>') : 'Standard finish';
  };

  return `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background: white;">
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #3B82F6; padding-bottom: 20px; margin-bottom: 30px;">
        <div>
          <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #3B82F6, #8B5CF6); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 10px;">
            <span style="color: white; font-size: 28px; font-weight: bold;">L</span>
          </div>
          <h1 style="margin: 0; font-size: 24px; color: #1F2937; font-weight: bold;">Luxone</h1>
          <p style="margin: 5px 0 0 0; color: #6B7280; font-size: 14px;">Premium Worktop Solutions</p>
        </div>
        <div style="text-align: right;">
          <p style="margin: 0; color: #6B7280; font-size: 14px;">www.theluxone.com</p>
          <p style="margin: 5px 0 0 0; color: #6B7280; font-size: 14px;">UAE • Premium Quality • Expert Installation</p>
        </div>
      </div>

      <!-- Quote Information -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
        <div style="background: #F9FAFB; padding: 20px; border-radius: 8px; border-left: 4px solid #3B82F6;">
          <h3 style="margin: 0 0 15px 0; color: #1F2937; font-size: 18px; font-weight: bold;">Quote Information</h3>
          <p style="margin: 5px 0; color: #374151;"><strong>Quote ID:</strong> ${quoteId}</p>
          <p style="margin: 5px 0; color: #374151;"><strong>Date:</strong> ${getCurrentDateTime()}</p>
          <p style="margin: 5px 0; color: #374151;"><strong>Valid Until:</strong> ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB')}</p>
        </div>
        
        <div style="background: #F9FAFB; padding: 20px; border-radius: 8px; border-left: 4px solid #8B5CF6;">
          <h3 style="margin: 0 0 15px 0; color: #1F2937; font-size: 18px; font-weight: bold;">Client Information</h3>
          <p style="margin: 5px 0; color: #374151;"><strong>Name:</strong> ${data.name || 'TBC'}</p>
          <p style="margin: 5px 0; color: #374151;"><strong>Contact:</strong> ${data.contactNumber || 'TBC'}</p>
          <p style="margin: 5px 0; color: #374151;"><strong>Location:</strong> ${data.location || 'TBC'}</p>
        </div>
      </div>

      <!-- Sales Consultant -->
      <div style="background: #EEF2FF; padding: 20px; border-radius: 8px; margin-bottom: 30px; border-left: 4px solid #6366F1;">
        <h3 style="margin: 0 0 15px 0; color: #1F2937; font-size: 18px; font-weight: bold;">Sales Consultant</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px;">
          <p style="margin: 5px 0; color: #374151;"><strong>Name:</strong> Ahmed Al-Rashid</p>
          <p style="margin: 5px 0; color: #374151;"><strong>Contact:</strong> +971 50 123 4567</p>
          <p style="margin: 5px 0; color: #374151;"><strong>Email:</strong> ahmed@theluxone.com</p>
        </div>
      </div>

      <!-- Project Specifications -->
      <div style="background: white; border: 1px solid #E5E7EB; border-radius: 8px; padding: 25px; margin-bottom: 30px;">
        <h3 style="margin: 0 0 20px 0; color: #1F2937; font-size: 20px; font-weight: bold; border-bottom: 2px solid #F3F4F6; padding-bottom: 10px;">Project Specifications</h3>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 25px; margin-bottom: 20px;">
          <div>
            <h4 style="margin: 0 0 10px 0; color: #1F2937; font-size: 16px; font-weight: bold;">Material & Layout</h4>
            <p style="margin: 5px 0; color: #374151;"><strong>Material:</strong> ${getMaterialInfo()}</p>
            <p style="margin: 5px 0; color: #374151;"><strong>Layout:</strong> ${getLayoutText(data.worktopLayout)}</p>
            <p style="margin: 5px 0; color: #374151;"><strong>Timeline:</strong> ${getTimelineText(data.timeline)}</p>
          </div>
          
          <div>
            <h4 style="margin: 0 0 10px 0; color: #1F2937; font-size: 16px; font-weight: bold;">Service & Application</h4>
            <p style="margin: 5px 0; color: #374151;"><strong>Service Level:</strong> ${getServiceLevelText(data.serviceLevel)}</p>
            <p style="margin: 5px 0; color: #374151;"><strong>Project Type:</strong> ${data.projectType || 'TBC'}</p>
            <p style="margin: 5px 0; color: #374151;"><strong>Sink Option:</strong> ${data.sinkOption ? data.sinkOption.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'None selected'}</p>
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <h4 style="margin: 0 0 10px 0; color: #1F2937; font-size: 16px; font-weight: bold;">Dimensions</h4>
          <div style="background: #F9FAFB; padding: 15px; border-radius: 6px; color: #374151;">
            ${getPiecesInfo()}
          </div>
        </div>

        <div>
          <h4 style="margin: 0 0 10px 0; color: #1F2937; font-size: 16px; font-weight: bold;">Design Features</h4>
          <div style="background: #F9FAFB; padding: 15px; border-radius: 6px; color: #374151;">
            ${getDesignFeatures()}
          </div>
        </div>
      </div>

      <!-- Comments -->
      ${data.additionalComments ? `
      <div style="background: #FEF3C7; border: 1px solid #F59E0B; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
        <h3 style="margin: 0 0 15px 0; color: #92400E; font-size: 18px; font-weight: bold;">Special Comments</h3>
        <p style="margin: 0; color: #92400E; line-height: 1.6;">${data.additionalComments}</p>
      </div>
      ` : ''}

      <!-- Pricing Section -->
      <div style="background: white; border: 1px solid #E5E7EB; border-radius: 8px; padding: 25px; margin-bottom: 30px;">
        <h3 style="margin: 0 0 20px 0; color: #1F2937; font-size: 20px; font-weight: bold; border-bottom: 2px solid #F3F4F6; padding-bottom: 10px;">Investment Summary</h3>
        
        <div style="text-align: center; padding: 20px 0;">
          <p style="color: #6B7280; margin-bottom: 10px; font-size: 16px;">Estimated Project Cost</p>
          <p style="color: #374151; margin-bottom: 5px; font-size: 14px;">Based on provided specifications and requirements</p>
          <p style="color: #1F2937; font-size: 32px; font-weight: bold; margin: 20px 0;">AED ${pricing.grandTotal.toLocaleString()}</p>
          <p style="color: #6B7280; font-size: 14px; margin-bottom: 20px;">Including VAT (5%)</p>
        </div>
        
        <div style="background: #FEF3C7; border: 1px solid #F59E0B; border-radius: 8px; padding: 15px; margin-top: 20px;">
          <p style="color: #92400E; font-weight: bold; margin: 0 0 10px 0; text-align: center;">Important Note</p>
          <p style="color: #92400E; margin: 0; text-align: center; font-size: 14px;">
            <strong>Actual quote will be shared upon final site measurements.</strong><br>
            This is a preliminary estimate based on your specifications. Final pricing may vary after professional site survey and precise measurements.
          </p>
        </div>
      </div>

      <!-- Terms and Conditions -->
      <div style="background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 15px 0; color: #1F2937; font-size: 16px; font-weight: bold;">Terms & Conditions</h3>
        <ul style="margin: 0; padding-left: 20px; color: #374151; font-size: 14px; line-height: 1.6;">
          <li>Quote valid for 30 days from date of issue</li>
          <li>This is a preliminary estimate - actual quote will be provided after site measurements</li>
          <li>50% deposit required to commence work</li>
          <li>Final measurements will be taken on-site before fabrication</li>
          <li>Installation includes templating, fabrication, delivery and professional installation</li>
          <li>All work comes with Luxone's 10-year guarantee</li>
          <li>Prices include VAT and are quoted in AED</li>
        </ul>
      </div>

      <!-- Footer -->
      <div style="text-align: center; padding-top: 20px; border-top: 1px solid #E5E7EB; color: #6B7280; font-size: 12px;">
        <p style="margin: 0;">© 2025 Luxone - Premium Worktop Solutions | UAE | www.theluxone.com</p>
        <p style="margin: 5px 0 0 0;">This quote was generated automatically by our quotation system.</p>
      </div>
    </div>
  `;
};

export const generateQuotePDF = async (data: QuotationData, quoteId: string, settings?: any): Promise<void> => {
  try {
    // Create a temporary container
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.width = '800px';
    container.innerHTML = createQuoteHTML(data, quoteId, settings || {});
    document.body.appendChild(container);

    // Generate canvas from HTML
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 800,
      windowWidth: 800
    });

    // Remove temporary container
    document.body.removeChild(container);

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    // Add first page
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Save the PDF
    const fileName = `Luxone_Quote_${data.name?.replace(/\s+/g, '_') || 'Customer'}_${new Date().toISOString().slice(0, 10)}.pdf`;
    pdf.save(fileName);

    // Show success message
    alert('Quote PDF generated successfully! The file has been downloaded.');
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};