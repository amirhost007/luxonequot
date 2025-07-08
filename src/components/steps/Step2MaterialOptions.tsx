import React from 'react';
import { useQuotation } from '../../context/QuotationContext';
import NavigationButtons from '../common/NavigationButtons';
import FileUpload from '../common/FileUpload';

const Step2MaterialOptions: React.FC = () => {
  const { data, updateData } = useQuotation();

  const quartzColors = [
    'AMBIENCE TOUCH', 'GOLDEN TRACK', 'GREY LEATHER', 'GOLDEN RIVER', 'IMPERIAL WHITE',
    'GREY WONDER', 'MOON WHITE', 'MAJESTIC WHITE', 'REBORN GREY', 'ROYAL STATUARIO',
    'STRIKE LIGHT', 'SUPER WAVE', 'THE AMBIENCE', 'THE GLACIER', 'SUPERME TAJ',
    'THE GROLD', 'THE SAINT', 'UNIVERSE GREY', 'WHITE BEAUTY', 'WHITE PAZZLE',
    'ROYAL AMBIENCE'
  ];

  const porcelainColors = [
    'ARCTIC WHITE', 'CHARCOAL GREY', 'CREAM MARBLE', 'DARK STONE', 'ELEGANT BLACK',
    'FROST WHITE', 'GRANITE GREY', 'IVORY CREAM', 'JET BLACK', 'MARBLE VEINS'
  ];

  const handleMaterialSourceChange = (source: string) => {
    updateData({ 
      materialSource: source as any,
      materialType: '',
      materialColor: ''
    });
  };

  const handleFileSelect = (file: File | null) => {
    updateData({ slabPhoto: file });
  };

  const isNextDisabled = () => {
    if (!data.materialSource) return true;
    
    if (data.materialSource === 'luxone') {
      return !data.materialType || !data.materialColor;
    }
    
    if (data.materialSource === 'yourself') {
      return !data.slabSize || !data.thickness || !data.finish;
    }
    
    if (data.materialSource === 'luxone-others') {
      return !data.luxoneOthersSlabSize || !data.luxoneOthersThickness || 
             !data.luxoneOthersFinish || !data.requiredSlabs || 
             !data.pricePerSlab || !data.brandSupplier || !data.luxoneOthersColorName;
    }
    
    return false;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Step 2 (of 9) - About your Material Options
        </h2>
        <p className="text-lg text-gray-600">
          Choose your material source and specifications.
        </p>
      </div>

      <div className="space-y-8">
        {/* Material Source Selection */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Select Material Source
          </h3>
          
         <div className="grid gap-3 md:grid-cols-3">

            {/* By Luxone Own Material */}
            <div
              onClick={() => handleMaterialSourceChange('luxone')}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                data.materialSource === 'luxone'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <h4 className="text-lg font-semibold text-gray-900 mb-1">
                By Luxone Own Material
              </h4>
              <p className="text-gray-600 text-sm">
                Choose from our premium Quartz and Porcelain collections
              </p>
            </div>

            {/* By Yourself */}
            <div
              onClick={() => handleMaterialSourceChange('yourself')}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                data.materialSource === 'yourself'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <h4 className="text-lg font-semibold text-gray-900 mb-1">
                By Yourself
              </h4>
              <p className="text-gray-600 text-sm">
                Provide your own material specifications
              </p>
            </div>

            {/* Luxone Others */}
            <div
              onClick={() => handleMaterialSourceChange('luxone-others')}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                data.materialSource === 'luxone-others'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <h4 className="text-lg font-semibold text-gray-900 mb-1">
                Luxone Others
              </h4>
              <p className="text-gray-600 text-sm">
                Other material options with custom specifications
              </p>
            </div>
          </div>
        </div>

        {/* Luxone Own Material Options */}
        {data.materialSource === 'luxone' && (
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Luxone Material Options
            </h4>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Material Type *
                </label>
                <select
                  value={data.materialType}
                  onChange={(e) => updateData({ materialType: e.target.value as any, materialColor: '' })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Material Type</option>
                  <option value="quartz">Luxone Quartz</option>
                  <option value="porcelain">Luxone Porcelain</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color *
                </label>
                <select
                  value={data.materialColor}
                  onChange={(e) => updateData({ materialColor: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={!data.materialType}
                >
                  <option value="">Select Color</option>
                  {(data.materialType === 'quartz' ? quartzColors : porcelainColors).map(color => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* By Yourself Options */}
        {data.materialSource === 'yourself' && (
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Your Material Details
            </h4>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slab Size *
                </label>
                <input
                  type="text"
                  value={data.slabSize || ''}
                  onChange={(e) => updateData({ slabSize: e.target.value })}
                  placeholder="e.g., 3200x1600mm"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thickness *
                </label>
                <input
                  type="text"
                  value={data.thickness || ''}
                  onChange={(e) => updateData({ thickness: e.target.value })}
                  placeholder="e.g., 20mm"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Finish *
                </label>
                <input
                  type="text"
                  value={data.finish || ''}
                  onChange={(e) => updateData({ finish: e.target.value })}
                  placeholder="e.g., Polished"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slab Photo
              </label>
              <FileUpload
                onFileSelect={handleFileSelect}
                selectedFile={data.slabPhoto || null}
                label="Upload slab photo"
              />
            </div>
          </div>
        )}

        {/* Luxone Others Options */}
        {data.materialSource === 'luxone-others' && (
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Luxone Others Details
            </h4>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slab Size *
                </label>
                <input
                  type="text"
                  value={data.luxoneOthersSlabSize || ''}
                  onChange={(e) => updateData({ luxoneOthersSlabSize: e.target.value })}
                  placeholder="e.g., 3200x1600mm"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thickness *
                </label>
                <input
                  type="text"
                  value={data.luxoneOthersThickness || ''}
                  onChange={(e) => updateData({ luxoneOthersThickness: e.target.value })}
                  placeholder="e.g., 20mm"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Finish *
                </label>
                <input
                  type="text"
                  value={data.luxoneOthersFinish || ''}
                  onChange={(e) => updateData({ luxoneOthersFinish: e.target.value })}
                  placeholder="e.g., Polished"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Required Slabs *
                </label>
                <input
                  type="text"
                  value={data.requiredSlabs || ''}
                  onChange={(e) => updateData({ requiredSlabs: e.target.value })}
                  placeholder="e.g., 3 slabs"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price per Slab *
                </label>
                <input
                  type="text"
                  value={data.pricePerSlab || ''}
                  onChange={(e) => updateData({ pricePerSlab: e.target.value })}
                  placeholder="e.g., AED 1200"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand/Supplier *
                </label>
                <input
                  type="text"
                  value={data.brandSupplier || ''}
                  onChange={(e) => updateData({ brandSupplier: e.target.value })}
                  placeholder="e.g., Caesarstone"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color Name *
                </label>
                <input
                  type="text"
                  value={data.luxoneOthersColorName || ''}
                  onChange={(e) => updateData({ luxoneOthersColorName: e.target.value })}
                  placeholder="e.g., Calacatta Gold"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <NavigationButtons
        isNextDisabled={isNextDisabled()}
      />
    </div>
  );
};

export default Step2MaterialOptions;