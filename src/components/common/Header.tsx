import React from 'react';
import { useQuotation } from '../../context/QuotationContext';
import { useAdmin } from '../../context/AdminContext';
import { Settings } from 'lucide-react';

const Header: React.FC = () => {
  const { currentStep, totalSteps } = useQuotation();
  const { setIsAdminMode } = useAdmin();
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
         <div className="flex items-center space-x-3">
  <div className="w-24 h-24 bg-white rounded-lg overflow-hidden flex items-center justify-center shadow">
    <img
              src="https://demo.theluxone.com/wp-content/uploads/2025/06/cropped-Luxone_HQ-1.png"
              alt="Luxone Logo"
              className="w-full h-full object-contain"
            />
  </div>
  <div>
    <h1 className="text-2xl font-bold text-gray-900">Luxone Quotation</h1>
    <p className="text-sm text-gray-600">www.theluxone.com</p>
  </div>
</div>

          <div className="flex items-center space-x-4">
            {/* <button
              onClick={() => setIsAdminMode(true)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              title="Admin Panel"
            >
              <Settings size={20} />
              <span className="text-sm">Admin</span>
            </button> */}
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">
                Step {currentStep} of {totalSteps}
              </div>
              <div className="text-sm font-medium text-gray-900">
                {Math.round(progressPercentage)}% Complete
              </div>
            </div>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;