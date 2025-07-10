import React, { useState } from 'react';
import { useQuotation } from '../../context/QuotationContext';
import NavigationButtons from '../common/NavigationButtons';
import FileUpload from '../common/FileUpload';
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';

const Step4WorktopSizes: React.FC = () => {
  const { data, updateData } = useQuotation();
  const [expandedPieces, setExpandedPieces] = useState<{ [key: string]: boolean }>({
    A: true // Start with first piece expanded
  });

  // Get all available piece letters (A-Z)
  const getAllPieceLetters = () => {
    const letters = [];
    for (let i = 65; i <= 90; i++) {
      letters.push(String.fromCharCode(i));
    }
    return letters;
  };

  // Get currently used pieces
  const getUsedPieces = () => {
    return Object.keys(data.pieces).filter(piece => 
      data.pieces[piece] && (
        data.pieces[piece].length || 
        data.pieces[piece].width || 
        data.pieces[piece].thickness
      )
    );
  };

  // Get next available piece letter
  const getNextAvailablePiece = () => {
    const usedPieces = getUsedPieces();
    const allLetters = getAllPieceLetters();
    return allLetters.find(letter => !usedPieces.includes(letter)) || 'A';
  };

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

  const addNewPiece = () => {
    const nextPiece = getNextAvailablePiece();
    const updatedPieces = {
      ...data.pieces,
      [nextPiece]: {
        length: '',
        width: '',
        thickness: ''
      }
    };
    updateData({ pieces: updatedPieces });
    
    // Expand the new piece
    setExpandedPieces(prev => ({
      ...prev,
      [nextPiece]: true
    }));
  };

  const removePiece = (piece: string) => {
    const updatedPieces = { ...data.pieces };
    delete updatedPieces[piece];
    updateData({ pieces: updatedPieces });
    
    // Remove from expanded state
    setExpandedPieces(prev => {
      const newState = { ...prev };
      delete newState[piece];
      return newState;
    });
  };

  const isNextDisabled = () => {
    // Check if at least one piece has all dimensions filled
    return !Object.values(data.pieces).some(piece => 
      piece && piece.length && piece.width && piece.thickness
    );
  };

  const isPieceComplete = (piece: string) => {
    const pieceData = data.pieces[piece];
    return pieceData && pieceData.length && pieceData.width && pieceData.thickness;
  };

  const usedPieces = getUsedPieces().sort();

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
        {/* Dimensions Input - Accordion Style */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Worktop Dimensions
            </h3>
            <button
              onClick={addNewPiece}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
              <span>Add More Piece</span>
            </button>
          </div>
          
          <div className="space-y-3">
            {usedPieces.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No pieces added yet</p>
                <button
                  onClick={addNewPiece}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add First Piece
                </button>
              </div>
            ) : (
              usedPieces.map((piece) => (
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
                    <div className="flex items-center space-x-2">
                      {usedPieces.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removePiece(piece);
                          }}
                          className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                      {expandedPieces[piece] ? (
                        <ChevronUp size={20} className="text-gray-500" />
                      ) : (
                        <ChevronDown size={20} className="text-gray-500" />
                      )}
                    </div>
                  </button>
                  
                  {expandedPieces[piece] && (
                    <div className="px-4 pb-4 border-t border-gray-100">
                      <div className="grid md:grid-cols-3 gap-4 mt-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Length (mm)
                          </label>
                          <input
                            type="text"
                            value={data.pieces[piece]?.length || ''}
                            onChange={(e) => handlePieceChange(piece, 'length', e.target.value)}
                            placeholder="e.g., 2400"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Width (mm)
                          </label>
                          <input
                            type="text"
                            value={data.pieces[piece]?.width || ''}
                            onChange={(e) => handlePieceChange(piece, 'width', e.target.value)}
                            placeholder="e.g., 600"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Thickness (mm)
                          </label>
                          <input
                            type="text"
                            value={data.pieces[piece]?.thickness || ''}
                            onChange={(e) => handlePieceChange(piece, 'thickness', e.target.value)}
                            placeholder="e.g., 20"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
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

      <NavigationButtons
        isNextDisabled={isNextDisabled()}
      />
    </div>
  );
};

export default Step4WorktopSizes;