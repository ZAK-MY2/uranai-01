'use client';

import React from 'react';
import { EnvironmentData } from '@/types/database';

interface EnvironmentalDataProps {
  environmentData?: EnvironmentData | null;
}

export function EnvironmentalData({ environmentData }: EnvironmentalDataProps) {
  const getMoonAge = (phase: number): string => {
    const moonAge = Math.round(phase * 29.53);
    return `${moonAge}日`;
  };
  
  const getEnergyLevel = (lunar: EnvironmentData['lunar'], weather: EnvironmentData['weather']): string => {
    // Calculate energy level based on lunar phase and weather conditions
    const lunarEnergy = lunar.illumination > 80 ? 0.4 : lunar.illumination > 50 ? 0.3 : 0.2;
    const pressureEnergy = weather.pressure > 1015 ? 0.3 : weather.pressure > 1010 ? 0.2 : 0.1;
    const humidityEnergy = weather.humidity < 60 ? 0.3 : weather.humidity < 80 ? 0.2 : 0.1;
    
    const totalEnergy = lunarEnergy + pressureEnergy + humidityEnergy;
    
    if (totalEnergy > 0.8) return '高調和';
    if (totalEnergy > 0.6) return '調和';
    if (totalEnergy > 0.4) return '中調和';
    return '低調和';
  };
  
  const data = environmentData ? [
    { 
      label: '月齢', 
      value: getMoonAge(environmentData.lunar.phase) 
    },
    { 
      label: '月相', 
      value: environmentData.lunar.phaseName 
    },
    { 
      label: '気温', 
      value: `${environmentData.weather.temperature}°C` 
    },
    { 
      label: '湿度', 
      value: `${environmentData.weather.humidity}%` 
    },
    { 
      label: '気圧', 
      value: `${environmentData.weather.pressure}hPa` 
    },
    { 
      label: 'エネルギー', 
      value: getEnergyLevel(environmentData.lunar, environmentData.weather) 
    }
  ] : [
    { label: '月齢', value: '13.2日' },
    { label: '月相', value: '満月前' },
    { label: '気温', value: '25°C' },
    { label: '湿度', value: '65%' },
    { label: '気圧', value: '1013hPa' },
    { label: 'エネルギー', value: '高調和' }
  ];
  
  // Additional moon distance data if available
  const moonDistance = environmentData?.lunar.distanceFromEarth;
  
  return (
    <div 
      className="border border-indigo-500/15 rounded-2xl p-6"
      style={{ animation: 'gentleFloat 35s infinite ease-in-out', animationDelay: '5s' }}
    >
      <h2 className="text-base font-extralight mb-5 text-indigo-400 tracking-wider">宇宙環境</h2>
      
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex justify-between items-center text-sm">
            <span className="opacity-70">{item.label}</span>
            <span className="text-violet-400 font-light">{item.value}</span>
          </div>
        ))}
        
        {moonDistance && (
          <>
            <div className="border-t border-indigo-500/10 my-3"></div>
            <div className="flex justify-between items-center text-sm">
              <span className="opacity-70">月距離</span>
              <span className="text-violet-400 font-light">{moonDistance.kilometers.toLocaleString()}km</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="opacity-70">月状態</span>
              <span className="text-violet-400 font-light text-xs">{moonDistance.phase}</span>
            </div>
          </>
        )}
        
        {environmentData && (
          <div className="mt-4 text-xs text-gray-500 opacity-50">
            Last updated: {new Date(environmentData.timestamp).toLocaleTimeString()}
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes gentleFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}