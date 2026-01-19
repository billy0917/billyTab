import React, { useState, useEffect } from 'react';
import { WidgetSize } from '../types';

interface ClockProps {
    size: WidgetSize;
}

const Clock: React.FC<ClockProps> = ({ size }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    const dayNum = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    return `${dayName} ${dayNum}, ${month}`;
  };

  const seconds = time.getSeconds();
  const milliseconds = time.getMilliseconds();
  const totalSeconds = seconds + milliseconds / 1000;
  const progress = totalSeconds / 60;
  
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progress * circumference;

  const isSmall = size === 'small';

  return (
    <div 
      className="w-full h-full bg-white/10 backdrop-blur-3xl rounded-[2rem] flex items-center justify-center relative overflow-hidden shadow-2xl border border-white/20 ring-1 ring-white/10 group hover:scale-[1.02] transition-transform duration-300"
    >
        <svg viewBox="0 0 200 200" className="w-full h-full p-2" preserveAspectRatio="xMidYMid meet">
          
          {/* Ticks - Only show on Medium/Large for cleaner look on small */}
          {!isSmall && Array.from({ length: 60 }).map((_, i) => {
            const angle = (i * 6) * (Math.PI / 180); 
            const isHourTick = i % 5 === 0;
            const r1 = 95; 
            const r2 = isHourTick ? 85 : 90; 
            const x1 = 100 + r1 * Math.sin(angle);
            const y1 = 100 - r1 * Math.cos(angle);
            const x2 = 100 + r2 * Math.sin(angle);
            const y2 = 100 - r2 * Math.cos(angle);
            return (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={isHourTick ? "#ef4444" : "rgba(255,255,255,0.2)"} strokeWidth={isHourTick ? 2 : 1} strokeLinecap="round" />
            );
          })}
          
          {/* Progress Ring Background */}
          <circle cx="100" cy="100" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={isSmall ? "8" : "12"} />

          <defs>
             <linearGradient id="clockGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#db2777" />
             </linearGradient>
          </defs>
          
          {/* Active Ring */}
          <circle
            cx="100" cy="100" r={radius} fill="none" stroke="url(#clockGradient)"
            strokeWidth={isSmall ? "8" : "12"}
            strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-75 ease-linear origin-center -rotate-90"
          />

          {/* Time Text */}
          <text
            x="100" y="100" textAnchor="middle" dominantBaseline="central"
            fill="white" fontSize={isSmall ? "56" : "48"} fontWeight="bold"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {formatTime(time)}
          </text>
          
          {/* Date Text - Hide on small */}
          {!isSmall && (
          <text
            x="100" y="135" textAnchor="middle" dominantBaseline="central"
            fill="rgba(255,255,255,0.6)" fontSize="10" fontWeight="600" letterSpacing="1" className="uppercase"
          >
            {formatDate(time)}
          </text>
          )}
        </svg>
    </div>
  );
};

export default Clock;