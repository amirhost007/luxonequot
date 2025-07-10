import React from 'react';
import { useQuotation } from '../../context/QuotationContext';
import NavigationButtons from '../common/NavigationButtons';
import { User, Wrench } from 'lucide-react';

const Step5DesignOptions: React.FC = () => {
  const { data, updateData } = useQuotation();

  const sinkOptions = [
    {
      id: 'client-provided',
      title: 'Sink provided by Client',
      description: 'Client will supply their own sink',
      icon: <User size={32} className="text-blue-600" />
    },
    {
      id: 'luxone-customized',
      title: 'Sink customized by Luxone',
      description: 'Luxone will provide and customize the sink',
      icon: <Wrench size={32} className="text-purple-600" />
    }
  ];

  const handleSinkOptionSelect = (option: string) => {
    updateData({ sinkOption: option });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Step 5 (of 8) - Design Options
        </h2>
        <p className="text-lg text-gray-600">
          Choose your sink option for the project.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          Select Sink Option
        </h3>

        <div className="grid gap-4 md:grid-cols-2">
          {sinkOptions.map((option) => (
            <div
              key={option.id}
              onClick={() => handleSinkOptionSelect(option.id)}
              className={`border-2 rounded-lg p-6 cursor-pointer transition-all duration-200 hover:shadow-md ${
                data.sinkOption === option.id
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="flex-shrink-0">{option.icon}</div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {option.title}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {option.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {data.sinkOption && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-medium">
              ✓ Sink option selected: {
                data.sinkOption === 'client-provided' 
                  ? 'Sink provided by Client' 
                  : 'Sink customized by Luxone'
              }
            </p>
          </div>
        )}
      </div>

      <NavigationButtons
        isNextDisabled={!data.sinkOption}
      />
    </div>
  );
};

export default Step5DesignOptions;