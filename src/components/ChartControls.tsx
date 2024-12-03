import React from 'react';
import { Camera } from 'lucide-react';
import html2canvas from 'html2canvas';

interface ChartControlsProps {
  onScreenshot: (imageData: string) => void;
}

const ChartControls: React.FC<ChartControlsProps> = ({ onScreenshot }) => {
  const captureChart = async () => {
    const chartElement = document.querySelector('.tradingview-widget-container');
    if (!chartElement) return;

    try {
      const canvas = await html2canvas(chartElement as HTMLElement);
      const imageData = canvas.toDataURL('image/png');
      onScreenshot(imageData);
    } catch (error) {
      console.error('Failed to capture screenshot:', error);
    }
  };

  return (
    <div className="flex justify-end mb-4">
      <button
        onClick={captureChart}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Camera size={20} />
        Capture Chart
      </button>
    </div>
  );
};

export default ChartControls;