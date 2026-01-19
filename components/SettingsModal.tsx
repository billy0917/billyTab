import React, { useEffect, useState } from 'react';
import { WidgetConfig, WidgetSize } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: WidgetConfig[];
  onConfigChange: (newConfig: WidgetConfig[]) => void;
  backgroundImage: string | null;
  onBackgroundChange: (url: string) => void;
  onBackgroundReset: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onConfigChange,
  backgroundImage,
  onBackgroundChange,
  onBackgroundReset
}) => {
  if (!isOpen) return null;

  const [bgUrlInput, setBgUrlInput] = useState('');

  useEffect(() => {
    setBgUrlInput(backgroundImage && !backgroundImage.startsWith('data:') ? backgroundImage : '');
  }, [backgroundImage]);

  const handleToggleVisibility = (id: string) => {
    const newConfig = config.map(w => 
      w.id === id ? { ...w, visible: !w.visible } : w
    );
    onConfigChange(newConfig);
  };

  const handleSizeChange = (id: string, size: WidgetSize) => {
    const newConfig = config.map(w => 
      w.id === id ? { ...w, size } : w
    );
    onConfigChange(newConfig);
  };

  const moveWidget = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === config.length - 1) return;

    const newConfig = [...config];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap order values
    const tempOrder = newConfig[index].order;
    newConfig[index].order = newConfig[targetIndex].order;
    newConfig[targetIndex].order = tempOrder;

    // Swap position in array
    [newConfig[index], newConfig[targetIndex]] = [newConfig[targetIndex], newConfig[index]];
    
    onConfigChange(newConfig);
  };

  // Sort by order for display
  const sortedConfig = [...config].sort((a, b) => a.order - b.order);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div 
        className="bg-gray-900/90 border border-white/10 rounded-3xl p-6 w-[90%] max-w-lg shadow-2xl text-white relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Customize Layout</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div className="space-y-4">
          {sortedConfig.map((widget, index) => (
            <div key={widget.id} className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/5">
              
              {/* Left: Name and Toggle */}
              <div className="flex items-center gap-4">
                 <button 
                   onClick={() => handleToggleVisibility(widget.id)}
                   className={`w-10 h-6 rounded-full relative transition-colors ${widget.visible ? 'bg-green-500' : 'bg-gray-600'}`}
                 >
                   <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${widget.visible ? 'left-5' : 'left-1'}`}></div>
                 </button>
                 <span className="font-medium capitalize">{widget.type}</span>
              </div>

              {/* Right: Controls */}
              <div className="flex items-center gap-3">
                 {/* Size Selector */}
                 <div className="flex bg-black/40 rounded-lg p-1">
                    {(['small', 'medium', 'large'] as WidgetSize[]).map((s) => (
                      <button
                        key={s}
                        onClick={() => handleSizeChange(widget.id, s)}
                        className={`px-3 py-1 text-xs rounded-md capitalize transition-all ${widget.size === s ? 'bg-white/20 text-white shadow-sm' : 'text-white/40 hover:text-white/70'}`}
                      >
                        {s.charAt(0)}
                      </button>
                    ))}
                 </div>

                 {/* Order Controls */}
                 <div className="flex flex-col gap-1">
                    <button 
                      onClick={() => moveWidget(index, 'up')}
                      disabled={index === 0}
                      className="text-white/50 hover:text-white disabled:opacity-20"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
                    </button>
                    <button 
                      onClick={() => moveWidget(index, 'down')}
                      disabled={index === sortedConfig.length - 1}
                      className="text-white/50 hover:text-white disabled:opacity-20"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </button>
                 </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-white/10">
          <h3 className="text-sm font-semibold mb-3">Background Image</h3>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Paste image URL"
              value={bgUrlInput}
              onChange={(e) => setBgUrlInput(e.target.value)}
              className="bg-black/30 border border-white/10 rounded-xl px-4 py-3 outline-none focus:bg-black/50 focus:border-white/30 transition-all placeholder-white/30"
            />
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  if (!bgUrlInput.trim()) return;
                  const formatted = bgUrlInput.startsWith('http') || bgUrlInput.startsWith('data:')
                    ? bgUrlInput
                    : `https://${bgUrlInput}`;
                  onBackgroundChange(formatted);
                }}
                className="bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Apply URL
              </button>
              <label className="bg-white/10 text-white px-4 py-2 rounded-lg font-semibold hover:bg-white/20 transition-colors cursor-pointer">
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => {
                      const result = reader.result?.toString();
                      if (result) onBackgroundChange(result);
                    };
                    reader.readAsDataURL(file);
                    e.currentTarget.value = '';
                  }}
                />
              </label>
              <button
                onClick={onBackgroundReset}
                className="bg-red-500/20 text-red-200 px-4 py-2 rounded-lg font-semibold hover:bg-red-500/30 transition-colors"
              >
                Reset to Random
              </button>
            </div>
            <p className="text-xs text-white/40">Custom background is saved locally in your browser.</p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 text-center">
          <p className="text-xs text-white/40">Adjust sizes: S (1 col), M (2 cols), L (Full)</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;