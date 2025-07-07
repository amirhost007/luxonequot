import React, { useState } from 'react';
import { useQuotation } from '../../context/QuotationContext';
import NavigationButtons from '../common/NavigationButtons';

import { Search } from 'lucide-react';

const Step7SinkOptions: React.FC = () => {
  const { data, updateData } = useQuotation();
  const [searchTerm, setSearchTerm] = useState('');

  const sinkCategories = [
    {
      title: 'No Sink Required',
      options: [
        { id: 'no-sink', title: 'No thanks' },
        { id: 'own-sink', title: 'I will supply my own sink' }
      ]
    },
    {
      title: 'Stainless Steel',
      options: [
        { id: 'ss-1-bowl', title: 'Stainless Steel - 1 Full Bowl' },
        { id: 'ss-1-half-bowl', title: 'Stainless Steel - 1 + 1/2 Bowl' },
        { id: 'ss-2-bowls', title: 'Stainless Steel - 2 Bowls' }
      ]
    },
    {
      title: 'Corian Sinks',
      options: [
        { id: 'tasty-9610', title: 'Tasty 9610 Corian Sink' },
        { id: 'rounded-9310', title: 'Rounded 9310 Corian Sink' },
        { id: 'salty-9410', title: 'Salty 9410 Corian Sink' },
        { id: 'smooth-850', title: 'Smooth 850 Corian Sink' },
        { id: 'smooth-873', title: 'Smooth 873 Corian Sink' }
      ]
    },
    {
      title: 'Corian Sparkling Sinks',
      options: [
        { id: 'sparkling-9501', title: 'Sparkling 9501 Corian Sink' },
        { id: 'sparkling-9502', title: 'Sparkling 9502 Corian Sink' },
        { id: 'sparkling-9503', title: 'Sparkling 9503 Corian Sink' },
        { id: 'sparkling-9504', title: 'Sparkling 9504 Corian Sink' },
        { id: 'sparkling-9505', title: 'Sparkling 9505 Corian Sink' }
      ]
    },
    {
      title: 'Corian Spicy Sinks',
      options: [
        { id: 'spicy-965', title: 'Spicy 965 Corian Sink' },
        { id: 'spicy-967-969', title: 'Spicy 967 + 969 Corian Sink - 1 + 1/2 Bowl' },
        { id: 'spicy-966', title: 'Spicy 966 Corian Sink' },
        { id: 'spicy-967', title: 'Spicy 967 Corian Sink' },
        { id: 'spicy-969', title: 'Spicy 969 Corian Sink' },
        { id: 'spicy-970', title: 'Spicy 970 Corian Sink' },
        { id: 'spicy-9910', title: 'Spicy 9910 Corian Sink' },
        { id: 'spicy-9920', title: 'Spicy 9920 Corian Sink' }
      ]
    },
    {
      title: 'Corian Sweet Sinks',
      options: [
        { id: 'sweet-802', title: 'Sweet 802 Corian Sink' },
        { id: 'sweet-804', title: 'Sweet 804 Corian Sink' },
        { id: 'sweet-805', title: 'Sweet 805 Corian Sink' },
        { id: 'sweet-809', title: 'Sweet 809 Corian Sink' },
        { id: 'sweet-857', title: 'Sweet 857 Corian Sink' },
        { id: 'sweet-859', title: 'Sweet 859 Corian Sink' },
        { id: 'sweet-871', title: 'Sweet 871 Corian Sink' },
        { id: 'sweet-881', title: 'Sweet 881 Corian Sink' }
      ]
    }
  ];

  const handleSinkSelect = (sinkId: string) => {
    updateData({ sinkOption: sinkId });
  };

  // Filter sink options based on search term
  const filteredCategories = sinkCategories.map(category => ({
    ...category,
    options: category.options.filter(option =>
      option.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.options.length > 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Step 7 (of 9) - Sink Options
        </h2>
        <p className="text-lg text-gray-600">
          Would you like your quote to include sink options? Choose from Corian sinks, stainless steel, or various bowl configurations.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {/* Search Field */}
        <div className="mb-6">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search sink options..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="space-y-6">
          {filteredCategories.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {category.title}
              </h3>
              
              <div className="grid md:grid-cols-2 gap-2">
                {category.options.map((option) => (
                  <div
                    key={option.id}
                    onClick={() => handleSinkSelect(option.id)}
                    className={`border-2 rounded-lg p-3 cursor-pointer transition-all duration-200 hover:shadow-sm ${
                      data.sinkOption === option.id
                        ? 'border-blue-500 bg-blue-50 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        data.sinkOption === option.id
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`} />
                      <span className="text-sm font-medium text-gray-900">
                        {option.title}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {data.sinkOption && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-medium">
            ✓ 1 sink option selected
          </p>
        </div>
      )}

      <NavigationButtons
        isNextDisabled={!data.sinkOption}
      />
    </div>
  );
};

export default Step7SinkOptions;