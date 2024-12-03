import React, { useCallback } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';

interface ChartUploadProps {
  onImageUpload: (imageData: string) => void;
  currentImage: string | null;
  onClear: () => void;
}

const ChartUpload: React.FC<ChartUploadProps> = ({ onImageUpload, currentImage, onClear }) => {
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        onImageUpload(result);
      }
    };
    reader.readAsDataURL(file);
  }, [onImageUpload]);

  return (
    <div className="w-full">
      {!currentImage ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
          <label className="flex flex-col items-center justify-center cursor-pointer">
            <Upload className="w-12 h-12 text-gray-400 mb-3" />
            <span className="text-sm text-gray-600">Upload your chart image</span>
            <span className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileUpload}
            />
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Select Image
            </button>
          </label>
        </div>
      ) : (
        <div className="relative">
          <img
            src={currentImage}
            alt="Uploaded chart"
            className="w-full rounded-lg border border-gray-200"
          />
          <button
            onClick={onClear}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            aria-label="Remove image"
          >
            <X size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ChartUpload;