import React from 'react';
import { useQuotation } from '../../context/QuotationContext';
import NavigationButtons from '../common/NavigationButtons';

const Step5DesignOptions: React.FC = () => {
  const { data, updateData } = useQuotation();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Step 5 (of 9) - Design Options
        </h2>
        <p className="text-lg text-gray-600">
          Select additional design features and options for your worktop.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Custom Edge */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Edge Required
            </label>
            <select
              value={data.customEdge}
              onChange={(e) => updateData({ customEdge: e.target.value as 'YES' | 'NO' })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Option</option>
              <option value="YES">YES</option>
              <option value="NO">NO</option>
            </select>
          </div>

          {/* Sink Cut Out */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sink Cut Out
            </label>
            <select
              value={data.sinkCutOut}
              onChange={(e) => updateData({ sinkCutOut: parseInt(e.target.value) as 0 | 1 | 2 })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Number</option>
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
            </select>
          </div>

          {/* Hob Cut Out */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hob Cut Out
            </label>
            <select
              value={data.hobCutOut}
              onChange={(e) => updateData({ hobCutOut: parseInt(e.target.value) as 0 | 1 | 2 })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Number</option>
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
            </select>
          </div>

          {/* Under Mounted Sink */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Under Mounted Sink
            </label>
            <select
              value={data.underMountedSink}
              onChange={(e) => updateData({ underMountedSink: e.target.value as 'YES' | 'NO' })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Option</option>
              <option value="YES">YES</option>
              <option value="NO">NO</option>
            </select>
          </div>

          {/* Drain Grooves */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Drain Grooves
            </label>
            <input
              type="number"
              min="0"
              value={data.drainGrooves || ''}
              onChange={(e) => updateData({ drainGrooves: e.target.value })}
              placeholder="Number of sets"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Tap Holes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tap Holes
            </label>
            <input
              type="number"
              min="0"
              value={data.tapHoles || ''}
              onChange={(e) => updateData({ tapHoles: e.target.value })}
              placeholder="Number of holes"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Steel Frame */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Steel Frame
            </label>
            <select
              value={data.steelFrame}
              onChange={(e) => updateData({ steelFrame: e.target.value as 'YES' | 'NO' })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Option</option>
              <option value="YES">YES</option>
              <option value="NO">NO</option>
            </select>
          </div>

          {/* Additional Cut Outs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Cut Outs
            </label>
            <input
              type="text"
              value={data.cutOuts}
              onChange={(e) => updateData({ cutOuts: e.target.value })}
              placeholder="Special shaped cut-outs"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Upstands */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upstands (length in meters)
            </label>
            <input
              type="text"
              value={data.upstands}
              onChange={(e) => updateData({ upstands: e.target.value })}
              placeholder="e.g., 3m"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <NavigationButtons />
    </div>
  );
};

export default Step5DesignOptions;