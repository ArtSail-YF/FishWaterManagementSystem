import { Typography } from 'antd';
import React from 'react';

const { Text } = Typography;

const WeatherSummary: React.FC = () => {
  const data = [
    { label: '杭州基地', value: '26.4°C', trend: 'up' },
    { label: '舟山基地', value: '22.1°C', trend: 'down' },
    { label: '宁波基地', value: '24.8°C', trend: 'up' },
    { label: '温州基地', value: '27.2°C', trend: 'up' },
    { label: '风力', value: '4.2m/s', trend: 'stable' },
    { label: '气压', value: '1012hPa', trend: 'down' },
  ];

  return (
    <div style={{ 
      backgroundColor: '#001529', 
      height: '32px', 
      display: 'flex', 
      alignItems: 'center', 
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      padding: '0 16px',
      borderBottom: '1px solid #1f1f1f'
    }}>
      <div style={{ 
        display: 'inline-flex', 
        animation: 'ticker 30s linear infinite',
        gap: '40px'
      }}>
        {[...data, ...data].map((item, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Text style={{ color: '#8c8c8c', fontSize: '12px' }}>{item.label}:</Text>
            <span className="fin-number" style={{ 
              color: item.trend === 'up' ? '#cf1322' : item.trend === 'down' ? '#52c41a' : '#fff',
              fontSize: '13px',
              fontWeight: 'bold'
            }}>
              {item.value} {item.trend === 'up' ? '▲' : item.trend === 'down' ? '▼' : ''}
            </span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default WeatherSummary;
