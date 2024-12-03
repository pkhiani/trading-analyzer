import React, { useState } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';

interface ChartControlsProps {
  onScreenshot: (imageData: string) => void;
}

const ChartControls: React.FC<ChartControlsProps> = ({ onScreenshot }) => {
  const [isCapturing, setIsCapturing] = useState(false);

  const captureChart = async () => {
    const chartElement = document.querySelector('.tradingview-widget-container');
    if (!chartElement) return;

    setIsCapturing(true);

    try {
      // Wait for the TradingView widget to be fully loaded
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const canvas = await html2canvas(chartElement as HTMLElement, {
        useCORS: true,
        allowTaint: true,
        foreignObjectRendering: true,
        logging: false,
        scale: 2,
        backgroundColor: null,
        onclone: (document) => {
          // Remove any unnecessary elements from the cloned document
          const clonedChart = document.querySelector('.tradingview-widget-container');
          if (clonedChart) {
            const copyright = clonedChart.querySelector('.tradingview-widget-copyright');
            if (copyright) {
              copyright.remove();
            }
          }
          return document;
        }
      });
      
      const imageData = canvas.toDataURL('image/png', 1.0);
      onScreenshot(imageData);
    } catch (error) {
      console.error('Failed to capture screenshot:', error);
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="flex justify-end mb-4">
      <button
        onClick={captureChart}
        disabled={isCapturing}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        {isCapturing ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Capturing...
          </>
        ) : (
          <>
            <Camera size={20} />
            Capture Chart
          </>
        )}
      </button>
    </div>
  );
};

export default ChartControls;