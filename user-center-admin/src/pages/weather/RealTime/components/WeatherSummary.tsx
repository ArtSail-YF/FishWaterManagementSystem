import { Typography, Spin } from 'antd';
import React, { useState, useEffect } from 'react';
import { getWeatherSummary, type WeatherSummaryItem } from '@/services/api/weather';

const { Text } = Typography;

const WeatherSummary: React.FC = () => {
  const [data, setData] = useState<WeatherSummaryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = () => {
      getWeatherSummary().then(res => {
        setData(res.data || []);
        setLoading(false);
      });
    };
    fetchData();
    const timer = setInterval(fetchData, 60000);
    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <div style={{ height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#001529' }}>
        <Spin size="small" />
      </div>
    );
  }

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
              color: item.trend === 'up' ? '#cf1322' : item.trend === 'down' ? '#6b7280' : '#fff',
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
