import React from 'react';
import { Search } from 'lucide-react';

interface SymbolInputProps {
  symbol: string;
  onSymbolChange: (symbol: string) => void;
  onSubmit: () => void;
}

const SymbolInput: React.FC<SymbolInputProps> = ({ symbol, onSymbolChange, onSubmit }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <div className="relative flex-1">
        <input
          type="text"
          value={symbol}
          onChange={(e) => onSymbolChange(e.target.value.toUpperCase())}
          placeholder="Enter stock symbol (e.g., AAPL)"
          className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
      </div>
    </form>
  );
};

export default SymbolInput;