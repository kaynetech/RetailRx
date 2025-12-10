import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  bgColor: string;
  textColor: string;
  icon: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  bgColor, 
  textColor,
  icon 
}) => {
  return (
    <div className={`${bgColor} ${textColor} rounded-lg p-6 shadow-lg`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm opacity-90 font-medium">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {subtitle && <p className="text-sm mt-2 opacity-80">{subtitle}</p>}
        </div>
        <span className="text-4xl opacity-80">{icon}</span>
      </div>
    </div>
  );
};
