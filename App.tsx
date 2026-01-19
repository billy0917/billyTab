import React, { useState, useEffect } from 'react';
import Clock from './components/Clock';
import SearchBar from './components/SearchBar';
import QuickLinks from './components/QuickLinks';
import WeatherWidget from './components/WeatherWidget';
import QuoteWidget from './components/QuoteWidget';
import SettingsModal from './components/SettingsModal';
import { WidgetConfig } from './types';

const backgrounds = [
  'https://picsum.photos/seed/nature/1920/1080',
  'https://picsum.photos/seed/mountain/1920/1080',
  'https://picsum.photos/seed/ocean/1920/1080',
  'https://picsum.photos/seed/forest/1920/1080',
  'https://picsum.photos/seed/sky/1920/1080',
];

const DEFAULT_WIDGET_CONFIG: WidgetConfig[] = [
  { id: 'weather-1', type: 'weather', size: 'small', visible: true, order: 0 },
  { id: 'clock-1', type: 'clock', size: 'medium', visible: true, order: 1 },
  { id: 'quote-1', type: 'quote', size: 'small', visible: true, order: 2 },
];

const App: React.FC = () => {
  const [bgImage, setBgImage] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [widgetConfig, setWidgetConfig] = useState<WidgetConfig[]>(() => {
    const saved = localStorage.getItem('zen_widget_config');
    return saved ? JSON.parse(saved) : DEFAULT_WIDGET_CONFIG;
  });

  useEffect(() => {
    const randomBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    const img = new Image();
    img.src = randomBg;
    img.onload = () => setBgImage(randomBg);
  }, []);

  useEffect(() => {
    localStorage.setItem('zen_widget_config', JSON.stringify(widgetConfig));
  }, [widgetConfig]);

  // Helper to get grid classes based on size
  const getGridSpan = (size: string) => {
    switch (size) {
      case 'small': return 'col-span-2 md:col-span-1'; // 1/4 on desktop, 1/2 on mobile
      case 'medium': return 'col-span-2 md:col-span-2'; // 2/4 on desktop, full on mobile
      case 'large': return 'col-span-2 md:col-span-4'; // Full width
      default: return 'col-span-1';
    }
  };

  const sortedWidgets = [...widgetConfig]
    .filter(w => w.visible)
    .sort((a, b) => a.order - b.order);

  const renderWidget = (widget: WidgetConfig) => {
    switch (widget.type) {
      case 'weather': return <WeatherWidget size={widget.size} />;
      case 'clock': return <Clock size={widget.size} />;
      case 'quote': return <QuoteWidget size={widget.size} />;
      default: return null;
    }
  };

  return (
    <div 
      className="h-screen w-screen overflow-hidden flex flex-col items-center justify-between relative bg-gray-900 transition-all duration-1000 ease-in-out"
      style={{
        backgroundImage: bgImage ? `url(${bgImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-0"></div>

      <main className="relative z-10 w-full max-w-[1200px] h-full mx-auto p-6 flex flex-col items-center justify-center gap-8 animate-fade-in">
        
        {/* 1. Search Bar */}
        <div className="w-full flex justify-center flex-none">
           <SearchBar />
        </div>

        {/* 2. Customizable Grid */}
        {/* We use a 4-column grid for standard sizing (S=1, M=2, L=4) */}
        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 shrink-0 justify-items-center items-center">
          {sortedWidgets.map((widget) => (
            <div 
              key={widget.id} 
              className={`${getGridSpan(widget.size)} w-full h-36 md:h-40 transition-all duration-500 ease-in-out`}
            >
              {renderWidget(widget)}
            </div>
          ))}
        </div>

        {/* 3. Quick Links */}
        <div className="w-full flex-none flex justify-center">
          <QuickLinks />
        </div>

      </main>

      {/* Footer & Settings Trigger */}
      <footer className="absolute bottom-4 w-full px-8 flex justify-between items-center z-20 pointer-events-none">
        <span className="text-white/20 text-[10px] font-light">ZenTab</span>
        <button 
          onClick={() => setIsSettingsOpen(true)}
          className="pointer-events-auto p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white/50 hover:text-white transition-all shadow-lg"
          title="Customize Layout"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.39a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
      </footer>

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        config={widgetConfig}
        onConfigChange={setWidgetConfig}
      />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default App;