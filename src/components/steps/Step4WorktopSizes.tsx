import React, { useState } from 'react';
import { useQuotation } from '../../context/QuotationContext';
import NavigationButtons from '../common/NavigationButtons';
import FileUpload from '../common/FileUpload';
import { ChevronDown, ChevronUp, Plus } from 'lucide-react';

const Step4WorktopSizes: React.FC = () => {
  const { data, updateData } = useQuotation();
  const [piecesList, setPiecesList] = useState<string[]>(['A', 'B', 'C', 'D', 'E', 'F']);
  const [expandedPieces, setExpandedPieces] = useState<{ [key: string]: boolean }>({ A: true });

  const handlePieceChange = (piece: string, field: string, value: string) => {
    const updatedPieces = {
      ...data.pieces,
      [piece]: {
        ...data.pieces[piece],
        [field]: value
      }
    };
    updateData({ pieces: updatedPieces });
  };

  const handleFileSelect = (file: File | null) => {
    updateData({ planSketch: file });
  };

  const togglePiece = (piece: string) => {
    setExpandedPieces(prev => ({
      ...prev,
      [piece]: !prev[piece]
    }));
  };

  const isNextDisabled = () => {
    return !Object.values(data.pieces).some(piece => 
      piece && piece.length && piece.width && piece.thickness
    );
  };

  const isPieceComplete = (piece: string) => {
    const pieceData = data.pieces[piece];
    return pieceData && pieceData.length && pieceData.width && pieceData.thickness;
  };

  const getNextPieceLabel = () => {
    // Convert last label to next alphabet (after Z goes to AA, AB, etc.)
    const last = piecesList[piecesList.length - 1];
    let next = '';
    let carry = true;

    for (let i = last.length - 1; i >= 0; i--) {
      if (carry) {
        const char = last[i];
        if (char === 'Z') {
          next = 'A' + next;
          carry = true;
        } else {
          next = String.fromCharCode(char.charCodeAt(0) + 1) + next;
          carry = false;
        }
      } else {
        next = last[i] + next;
      }
    }

    if (carry) next = 'A' + next;

    return next;
  };

  const handleAddPiece = () => {
    const newPiece = getNextPieceLabel();
    setPiecesList(prev => [...prev, newPiece]);

    setExpandedPieces(prev => ({
      ...prev,
      [newPiece]: true
    }));

    updateData({
      pieces: {
        ...data.pieces,
        [newPiece]: { length: '', width: '', thickness: '' }
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Step 4 (of 8) - Worktop Dimensions
        </h2>
        <p className="text-lg text-gray-600">
          Provide the dimensions for each piece of your worktop.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Worktop Dimensions
          </h3>
          
          <div className="space-y-3">
            {piecesList.map((piece) => (
              <div key={piece} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <button
                  onClick={() => togglePiece(piece)}
                  className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-medium text-gray-900">
                      Piece {piece}
                    </span>
                    {isPieceComplete(piece) && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Complete
                      </span>
                    )}
                  </div>
                  {expandedPieces[piece] ? (
                    <ChevronUp size={20} className="text-gray-500" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-500" />
                  )}
                </button>

                {expandedPieces[piece] && (
                  <div className="px-4 pb-4 border-t border-gray-100">
                    <div className="grid md:grid-cols-3 gap-4 mt-4">
                      {['length', 'width', 'thickness'].map(field => (
                        <div key={field}>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {field.charAt(0).toUpperCase() + field.slice(1)} (mm)
                          </label>
                          <input
                            type="text"
                            value={data.pieces[piece]?.[field] || ''}
                            onChange={(e) => handlePieceChange(piece, field, e.target.value)}
                            placeholder={`e.g., ${field === 'length' ? '2400' : field === 'width' ? '600' : '20'}`}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            <button
              onClick={handleAddPiece}
              className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
            >
              <Plus size={18} className="mr-2" /> Add Another Piece
            </button>
          </div>
        </div>

        {/* Plan Upload */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Upload Plan or Sketch (Optional)
          </h3>
          <p className="text-gray-600 mb-4">
            You can upload a plan, sketch, or photo for reference to help us better understand your requirements.
          </p>
          <FileUpload
            onFileSelect={handleFileSelect}
            selectedFile={data.planSketch || null}
            label="Upload plan, sketch, or photo"
          />
        </div>
      </div>

      <NavigationButtons isNextDisabled={isNextDisabled()} />
    </div>
  );
};

export default Step4WorktopSizes;
