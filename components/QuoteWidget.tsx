import React, { useState, useEffect } from 'react';
import { InspirationData, WidgetSize } from '../types';

interface QuoteWidgetProps {
    size: WidgetSize;
}

const QuoteWidget: React.FC<QuoteWidgetProps> = ({ size }) => {
  const [data, setData] = useState<InspirationData | null>(null);
  const [loading, setLoading] = useState(true);

  const inspirationPool: InspirationData[] = [
    {
      quote: "The only way to do great work is to love what you do.",
      author: "Steve Jobs",
      tip: "Focus on one big task at a time."
    },
    {
      quote: "Small progress is still progress.",
      author: "Unknown",
      tip: "Start with a 5-minute timer and build momentum."
    },
    {
      quote: "Success is the sum of small efforts repeated day in and day out.",
      author: "Robert Collier",
      tip: "Pick one habit to repeat daily this week."
    },
    {
      quote: "You don’t have to be extreme, just consistent.",
      author: "Unknown",
      tip: "Block distractions for one focused session."
    }
  ];

  const getDailyInspiration = (): InspirationData => {
    const today = new Date().toDateString();
    const hash = Array.from(today).reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return inspirationPool[hash % inspirationPool.length];
  };

  useEffect(() => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem('zen_inspiration');
    
    if (stored) {
      const { date, data } = JSON.parse(stored);
      if (date === today) {
        setData(data);
        setLoading(false);
        return;
      }
    }

    const loadData = async () => {
      const result = getDailyInspiration();
      setData(result);
      localStorage.setItem('zen_inspiration', JSON.stringify({
        date: today,
        data: result
      }));
      setLoading(false);
    };
    loadData();
  }, []);

  const isSmall = size === 'small';

  return (
    <div className={`w-full h-full bg-white/10 backdrop-blur-3xl rounded-[2rem] text-white shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300 flex flex-col justify-between border border-white/20 ring-1 ring-white/10 ${isSmall ? 'p-5' : 'p-6'}`}>
      
      <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl opacity-60"></div>
      
      {!isSmall && (
        <div className="absolute top-4 right-4 text-purple-300 opacity-20 transform rotate-12">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14.017 21L14.017 18C14.017 16.8954 13.1216 16 12.0171 16H9.01714C7.91257 16 7.01714 16.8954 7.01714 18V21H2.01714V8.00002C2.01714 5.2386 4.25572 3.00002 7.01714 3.00002H17.0171C19.7786 3.00002 22.0171 5.2386 22.0171 8.00002V21H14.017Z" />
            </svg>
        </div>
      )}

      <div className="relative z-10 h-full flex flex-col justify-center">
        <div>
          {!isSmall && <h3 className="text-[10px] font-bold text-purple-300 uppercase tracking-wider mb-2">Daily Insight</h3>}
          {loading ? (
             <div className="space-y-2 animate-pulse">
               <div className="h-4 bg-white/10 rounded w-3/4"></div>
               <div className="h-4 bg-white/10 rounded w-1/2"></div>
             </div>
          ) : (
            <p className={`${isSmall ? 'text-sm font-semibold line-clamp-4 leading-relaxed' : 'text-lg md:text-xl font-medium leading-snug line-clamp-3'} text-white`}>
              "{data?.quote}"
            </p>
          )}
        </div>
        
        {!loading && data && !isSmall && (
          <div className="mt-3">
            <p className="text-sm text-white/50 font-medium">— {data.author}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuoteWidget;