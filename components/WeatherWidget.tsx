import React, { useEffect, useState } from 'react';
import { fetchHKWeather, getWeatherDescription, getWeatherIconType, WeatherData } from '../services/weatherService';
import { WidgetSize } from '../types';

const WeatherIcon: React.FC<{ type: string; className?: string }> = ({ type, className = "" }) => {
  if (type === 'sun') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-yellow-300 ${className}`}>
        <circle cx="12" cy="12" r="4" className="fill-yellow-300 stroke-none" />
        <path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
      </svg>
    );
  }
  if (type === 'rain') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-blue-200 ${className}`}>
        <path d="M17.5 19c0-1.7-1.3-3-3-3h-11a3 3 0 0 0-3 3h17z" />
        <path d="M14.5 16a5 5 0 0 0 5-5c0-2.8-2.2-5-5-5a5 5 0 0 0-5 5c0 .3 0 .6.1.9" />
        <path d="M8 13v-1a2 2 0 0 0-2-2h0a2 2 0 0 0-2 2v1" strokeOpacity="0" /> 
        <path d="M8 19v2" /><path d="M12 19v2" /><path d="M16 19v2" />
      </svg>
    );
  }
  if (type === 'storm') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-purple-200 ${className}`}>
        <path d="M17.5 19c0-1.7-1.3-3-3-3h-11a3 3 0 0 0-3 3h17z" />
        <path d="M14.5 16a5 5 0 0 0 5-5c0-2.8-2.2-5-5-5a5 5 0 0 0-5 5c0 .3 0 .6.1.9" />
        <path d="M13 19l-2 3h4l-2 3" />
      </svg>
    );
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-gray-100 ${className}`}>
       <path d="M17.5 19c0-1.7-1.3-3-3-3h-11a3 3 0 0 0-3 3h17z" />
       <path d="M14.5 16a5 5 0 0 0 5-5c0-2.8-2.2-5-5-5a5 5 0 0 0-5 5c0 .3 0 .6.1.9" />
       <circle cx="10" cy="10" r="3" className="fill-yellow-400 stroke-none opacity-40"/>
    </svg>
  );
};

interface WeatherWidgetProps {
  size: WidgetSize;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ size }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWeather = async () => {
      try {
        const data = await fetchHKWeather();
        setWeather(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadWeather();
    const interval = setInterval(loadWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getForecastItems = () => {
    if (!weather) return [];
    
    // Config: Show 5 items for large, 3 for medium/small
    const count = size === 'large' ? 5 : 3;
    
    const currentHourIndex = new Date().getHours();
    const items = [];
    const intervals = [3, 6, 9, 12, 15]; // +3h, +6h, +9h...
    
    for (let i = 0; i < count; i++) {
        const offset = intervals[i];
        if(!offset) break;
        const idx = currentHourIndex + offset;
        
        if (idx < weather.hourly.time.length) {
            const timeStr = weather.hourly.time[idx];
            const date = new Date(timeStr);
            const hour = date.getHours();
            const displayTime = `${hour % 12 || 12}${hour >= 12 ? 'pm' : 'am'}`;
            items.push({
              time: displayTime,
              temp: Math.round(weather.hourly.temperature_2m[idx]),
            });
        }
    }
    return items;
  };

  const forecast = getForecastItems();

  if (loading) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 rounded-[2rem] p-5 shadow-2xl animate-pulse border border-white/10 flex items-center justify-center">
        <span className="text-white/50 text-xs font-medium">Loading...</span>
      </div>
    );
  }

  if (!weather) {
    return (
       <div className="w-full h-full bg-gray-700 rounded-[2rem] p-5 flex items-center justify-center text-white/50 text-xs">
         Unavailable
       </div>
    );
  }

  const currentIcon = getWeatherIconType(weather.current.code);
  const isSmall = size === 'small';

  return (
    <div className={`w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 rounded-[2rem] text-white shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300 border border-white/10 ${isSmall ? 'p-4' : 'p-6'}`}>
      
      {/* Background Effect */}
      <div className={`absolute top-[-20px] right-[-20px] rounded-full blur-2xl ${weather.current.isDay ? 'bg-yellow-300/20' : 'bg-purple-900/40'} ${isSmall ? 'w-20 h-20' : 'w-32 h-32'}`}></div>
      
      <div className="flex flex-col justify-between h-full relative z-10 overflow-hidden">
        
        {/* Top Section: Main Temp & Icon */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col z-20">
            <span className={`${isSmall ? 'text-4xl' : 'text-5xl md:text-6xl'} font-semibold tracking-tighter drop-shadow-lg leading-none`}>
              {Math.round(weather.current.temp)}°
            </span>
            <div className="flex flex-col">
              <p className={`text-blue-100 font-medium ${isSmall ? 'text-xs mt-1' : 'mt-1 text-lg'} whitespace-nowrap overflow-hidden text-ellipsis opacity-90`}>
                {getWeatherDescription(weather.current.code)}
              </p>
              {!isSmall && <p className="text-blue-200 text-xs font-light">Hong Kong</p>}
            </div>
          </div>
          
          <div className={`${isSmall ? 'scale-90 origin-top-right' : 'p-2 bg-white/10 rounded-2xl backdrop-blur-sm ml-2'}`}>
             <WeatherIcon type={currentIcon} className={`${isSmall ? 'w-8 h-8' : 'w-10 h-10 md:w-12 md:h-12'} drop-shadow-md`} />
          </div>
        </div>

        {/* Forecast Row (Visible on ALL sizes now) */}
        <div className={`flex justify-between items-end w-full gap-1 ${isSmall ? 'mt-auto pt-2 border-t border-white/10' : 'mt-2'}`}>
          {forecast.map((item, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <span className={`${isSmall ? 'text-[9px]' : 'text-[10px] md:text-xs'} text-blue-100 font-medium opacity-70 whitespace-nowrap`}>
                {item.time}
              </span>
              <span className={`${isSmall ? 'text-sm' : 'text-sm md:text-base'} font-bold drop-shadow-sm`}>
                {item.temp}°
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default WeatherWidget;