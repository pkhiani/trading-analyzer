import React from 'react';
import { LineChart, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { format } from 'date-fns';

interface MetricCardProps {
  title: string;
  value: string;
  trend: 'up' | 'down' | 'neutral';
  change?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, trend, change }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-md">
      <div className="flex items-center justify-between">
        <h3 className="text-gray-500 text-sm">{title}</h3>
        {trend === 'up' && <ArrowUpRight className="text-green-500" size={20} />}
        {trend === 'down' && <ArrowDownRight className="text-red-500" size={20} />}
        {trend === 'neutral' && <Activity className="text-blue-500" size={20} />}
      </div>
      <p className="text-2xl font-bold mt-2">{value}</p>
      {change && (
        <p className={`text-sm ${trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-blue-500'}`}>
          {change}
        </p>
      )}
    </div>
  );
};

const Dashboard: React.FC = () => {
  return (
    <div className="p-6 bg-gray-50">
      <div className="mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <LineChart className="text-blue-600" />
          Market Overview
        </h2>
        <p className="text-gray-600">Last updated: {format(new Date(), 'PPpp')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="NASDAQ Composite"
          value="15,990.50"
          trend="up"
          change="+1.25%"
        />
        <MetricCard
          title="S&P 500"
          value="4,783.20"
          trend="up"
          change="+0.85%"
        />
        <MetricCard
          title="Market Volatility"
          value="Medium"
          trend="neutral"
        />
        <MetricCard
          title="Trading Volume"
          value="2.5B"
          trend="down"
          change="-3.2%"
        />
      </div>
    </div>
  );
};

export default Dashboard;