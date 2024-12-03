import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface ChartPreviewProps {
  imageData: string | null;
  onClose: () => void;
}

const ChartPreview: React.FC<ChartPreviewProps> = ({ imageData, onClose }) => {
  if (!imageData) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Chart Preview</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close preview"
        >
          <X size={20} />
        </button>
      </div>
      
      <div className="relative">
        <img 
          src={imageData} 
          alt="Captured chart" 
          className="w-full rounded-lg border border-gray-200"
        />
        <div className="absolute bottom-4 left-4 bg-black/75 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-2">
          <AlertTriangle size={16} />
          Preview only - Analysis will use full resolution image
        </div>
      </div>
    </div>
  );
};

export default ChartPreview;