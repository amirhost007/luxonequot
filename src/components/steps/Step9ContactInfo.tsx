import React from 'react';
import { useQuotation } from '../../context/QuotationContext';
import { User, Phone, MapPin, MessageSquare, FileText, Mail, Palette } from 'lucide-react';

const Step8ContactInfo: React.FC = () => {
  const { data, updateData, submitQuote } = useQuotation();

  const locationOptions = [
    'Dubai',
    'Abu Dhabi', 
    'Sharjah',
    'Ajman',
    'Umm Al Quwain',
    'Ras Al Khaimah',
    'Fujairah'
  ];

  const handleSubmit = () => {
    submitQuote();
  };

  const isFormValid = () => {
    return data.name && data.contactNumber && data.location && data.email &&
           data.designerName && data.designerContact && data.designerEmail;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Step 8 (of 8) - Contact Information
        </h2>
        <p className="text-lg text-gray-600">
          Please provide client details and designer contact information.
        </p>
      </div>

      <div className="space-y-8">
        {/* Client Details Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <User size={24} className="mr-2 text-blue-600" />
            Client Details
          </h3>
          
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <User size={16} className="mr-2 text-blue-600" />
                  Client Name *
                </label>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => updateData({ name: e.target.value })}
                  placeholder="Client full name"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Phone size={16} className="mr-2 text-blue-600" />
                  Client Contact Number *
                </label>
                <input
                  type="tel"
                  value={data.contactNumber}
                  onChange={(e) => updateData({ contactNumber: e.target.value })}
                  placeholder="01234 567890"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Mail size={16} className="mr-2 text-blue-600" />
                  Client Email Address *
                </label>
                <input
                  type="email"
                  value={data.email || ''}
                  onChange={(e) => updateData({ email: e.target.value })}
                  placeholder="client.email@example.com"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <MapPin size={16} className="mr-2 text-blue-600" />
                Project Location *
              </label>
              <select
                value={data.location}
                onChange={(e) => updateData({ location: e.target.value as any })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Select project location</option>
                {locationOptions.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <MessageSquare size={16} className="mr-2 text-blue-600" />
                Additional Comments or Project Details (Optional)
              </label>
              <textarea
                value={data.additionalComments}
                onChange={(e) => updateData({ additionalComments: e.target.value })}
                placeholder="Please share any additional details about the project:
• Current stage of renovation
• Access considerations for installation  
• Special requirements or preferences
• Preferred contact times
• Any other questions or concerns"
                rows={6}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
              />
              <p className="text-sm text-gray-500 mt-2">
                This information helps us provide the most accurate quote and service.
              </p>
            </div>
          </div>
        </div>

        {/* Designer Details Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Palette size={24} className="mr-2 text-purple-600" />
            Designer Details
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <User size={16} className="mr-2 text-purple-600" />
                Designer Name *
              </label>
              <input
                type="text"
                value={data.designerName || ''}
                onChange={(e) => updateData({ designerName: e.target.value })}
                placeholder="Designer full name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              />
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Phone size={16} className="mr-2 text-purple-600" />
                Designer Contact Number *
              </label>
              <input
                type="tel"
                value={data.designerContact || ''}
                onChange={(e) => updateData({ designerContact: e.target.value })}
                placeholder="01234 567890"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              />
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Mail size={16} className="mr-2 text-purple-600" />
                Designer Email Address *
              </label>
              <input
                type="email"
                value={data.designerEmail || ''}
                onChange={(e) => updateData({ designerEmail: e.target.value })}
                placeholder="designer.email@example.com"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
        <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
          <FileText size={20} className="mr-2" />
          Privacy & Data Protection
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• Your personal information is securely stored and will only be used to process your quotation request.</li>
          <li>• We will contact you within 24 hours to discuss your project requirements.</li>
          <li>• Your details will not be shared with third parties without your explicit consent.</li>
          <li>• You can request removal of your data at any time by contacting us.</li>
        </ul>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-8">
        <button
          onClick={() => updateData({ __currentStep: 7 } as any)}
          className="flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        >
          <span>Back</span>
        </button>

        <button
          onClick={handleSubmit}
          disabled={!isFormValid()}
          className={`flex items-center space-x-2 px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
            !isFormValid()
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
          }`}
        >
          <FileText size={20} />
          <span>Generate Quote PDF</span>
        </button>
      </div>
    </div>
  );
};

export default Step8ContactInfo;