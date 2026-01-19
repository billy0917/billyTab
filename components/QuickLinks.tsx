import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shortcut } from '../types';

const DEFAULT_SHORTCUTS: Shortcut[] = [
  { id: '1', title: 'YouTube', url: 'https://www.youtube.com' },
  { id: '2', title: 'GitHub', url: 'https://github.com' },
  { id: '3', title: 'Gmail', url: 'https://mail.google.com' },
  { id: '4', title: 'Reddit', url: 'https://www.reddit.com' },
  { id: '5', title: 'Twitter', url: 'https://twitter.com' },
  { id: '6', title: 'ChatGPT', url: 'https://chat.openai.com' },
  { id: '7', title: 'Netflix', url: 'https://netflix.com' },
  { id: '8', title: 'Figma', url: 'https://figma.com' },
];

const getFaviconUrl = (urlString: string) => {
  try {
    const url = urlString.startsWith('http') ? urlString : `https://${urlString}`;
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  } catch (e) {
    return '';
  }
};

const normalizeIconUrl = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('data:')) return trimmed;

  const withProtocol = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
  const isImageUrl = /\.(png|jpe?g|gif|webp|svg|ico)(\?.*)?$/i.test(withProtocol);

  if (isImageUrl) return withProtocol;

  return getFaviconUrl(withProtocol);
};

const QuickLinks: React.FC = () => {
  const [shortcuts, setShortcuts] = useState<Shortcut[]>(() => {
    const saved = localStorage.getItem('zen_shortcuts');
    return saved ? JSON.parse(saved) : DEFAULT_SHORTCUTS;
  });

  const [isEditing, setIsEditing] = useState(false);
  const [newShortcut, setNewShortcut] = useState({ title: '', url: '', iconUrl: '' });
  const [newShortcutIconData, setNewShortcutIconData] = useState<string | null>(null);
  const [editingShortcut, setEditingShortcut] = useState<Shortcut | null>(null);
  const [editIconUrl, setEditIconUrl] = useState('');
  const [editIconData, setEditIconData] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('zen_shortcuts', JSON.stringify(shortcuts));
  }, [shortcuts]);

  const addShortcut = () => {
    if (!newShortcut.title || !newShortcut.url) return;
    const formattedUrl = newShortcut.url.startsWith('http') ? newShortcut.url : `https://${newShortcut.url}`;
    const icon = newShortcutIconData || normalizeIconUrl(newShortcut.iconUrl) || undefined;
    
    setShortcuts([...shortcuts, { 
      id: Date.now().toString(), 
      title: newShortcut.title, 
      url: formattedUrl,
      icon
    }]);
    setNewShortcut({ title: '', url: '', iconUrl: '' });
    setNewShortcutIconData(null);
    setIsEditing(false);
  };

  const removeShortcut = (id: string) => {
    setShortcuts(shortcuts.filter(s => s.id !== id));
  };

  const openEditIcon = (shortcut: Shortcut) => {
    setEditingShortcut(shortcut);
    setEditIconUrl(shortcut.icon && !shortcut.icon.startsWith('data:') ? shortcut.icon : '');
    setEditIconData(null);
  };

  const saveEditIcon = () => {
    if (!editingShortcut) return;
    const icon = editIconData || normalizeIconUrl(editIconUrl) || undefined;
    setShortcuts(shortcuts.map(s => s.id === editingShortcut.id ? { ...s, icon } : s));
    setEditingShortcut(null);
  };

  const clearEditIcon = () => {
    if (!editingShortcut) return;
    setShortcuts(shortcuts.map(s => s.id === editingShortcut.id ? { ...s, icon: undefined } : s));
    setEditingShortcut(null);
  };

  const moveShortcut = (fromId: string, toId: string) => {
    if (fromId === toId) return;
    const fromIndex = shortcuts.findIndex(s => s.id === fromId);
    const toIndex = shortcuts.findIndex(s => s.id === toId);
    if (fromIndex === -1 || toIndex === -1) return;
    const updated = [...shortcuts];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setShortcuts(updated);
  };

  return (
    <div className="w-full flex flex-col items-center gap-4">
      {/* Grid of Apps */}
      <div className="flex flex-wrap justify-center gap-4 md:gap-6 max-w-5xl">
        <AnimatePresence initial={false}>
        {shortcuts.map((shortcut) => (
          <motion.div
            layout
            key={shortcut.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={`relative group flex flex-col items-center justify-center ${draggingId === shortcut.id ? 'opacity-40' : ''}`}
            draggable
            onDragStart={(e) => {
              setDraggingId(shortcut.id);
              e.dataTransfer.effectAllowed = 'move';
              e.dataTransfer.setData('text/plain', shortcut.id);
            }}
            onDragEnd={() => setDraggingId(null)}
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = 'move';
            }}
            onDragEnter={(e) => {
              if (draggingId && draggingId !== shortcut.id) {
                moveShortcut(draggingId, shortcut.id);
              }
            }}
            onDrop={(e) => {
              e.preventDefault();
            }}
            title="Drag to reorder"
            role="button"
            aria-label={`Move ${shortcut.title}`}
          >
            <a
              href={shortcut.url}
              className="w-14 h-14 md:w-16 md:h-16 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-[18px] md:rounded-[22px] flex items-center justify-center transition-all duration-300 shadow-lg group-hover:scale-110 group-hover:shadow-xl border border-white/5"
            >
              <img 
                src={shortcut.icon || getFaviconUrl(shortcut.url)} 
                alt={shortcut.title}
                className="w-7 h-7 md:w-8 md:h-8 object-contain drop-shadow-md rounded-md opacity-90 group-hover:opacity-100 transition-opacity"
                onError={(e) => {
                    (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Ccircle cx='12' cy='12' r='10' opacity='0.5'/%3E%3C/svg%3E";
                }}
              />
            </a>
            
            <span className="absolute -bottom-6 text-[10px] font-medium text-white/80 tracking-wide opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-[-5px] group-hover:translate-y-0 pointer-events-none whitespace-nowrap bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-sm">
              {shortcut.title}
            </span>
            
            <button
              onClick={(e) => { e.preventDefault(); removeShortcut(shortcut.id); }}
              className="absolute -top-2 -right-2 w-5 h-5 bg-black/60 rounded-full text-white hover:text-red-400 hover:bg-black opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center border border-white/10 shadow-sm z-20 scale-75 group-hover:scale-100"
            >
              ×
            </button>

            <button
              onClick={(e) => { e.preventDefault(); openEditIcon(shortcut); }}
              className="absolute -top-2 -left-2 w-5 h-5 bg-black/60 rounded-full text-white hover:text-purple-300 hover:bg-black opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center border border-white/10 shadow-sm z-20 scale-75 group-hover:scale-100"
              title="Edit Icon"
            >
              ✎
            </button>
          </motion.div>
        ))}
        </AnimatePresence>

        {/* Add Button */}
        <motion.div layout className="flex flex-col items-center justify-center">
            <button
            onClick={() => setIsEditing(!isEditing)}
            className="w-14 h-14 md:w-16 md:h-16 bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-[18px] md:rounded-[22px] flex items-center justify-center transition-all duration-300 border border-white/10 border-dashed group"
            >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/30 group-hover:text-white/80 transition-colors">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            </button>
        </motion.div>
      </div>

      {/* Edit Panel (Absolute positioning to not push content) */}
      {isEditing && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 glass-panel p-6 rounded-2xl flex flex-col gap-4 animate-fade-in text-white w-[90%] max-w-md shadow-2xl border border-white/20">
          <div className="flex justify-between items-center mb-1">
             <h3 className="font-medium text-lg">Add Shortcut</h3>
             <button onClick={() => setIsEditing(false)} className="text-white/50 hover:text-white">✕</button>
          </div>
          <input
            type="text"
            placeholder="Name (e.g. YouTube)"
            value={newShortcut.title}
            onChange={(e) => setNewShortcut({...newShortcut, title: e.target.value})}
            className="bg-black/30 border border-white/10 rounded-xl px-4 py-3 outline-none focus:bg-black/50 focus:border-white/30 transition-all placeholder-white/30"
          />
          <input
            type="text"
            placeholder="URL (e.g. youtube.com)"
            value={newShortcut.url}
            onChange={(e) => setNewShortcut({...newShortcut, url: e.target.value})}
            className="bg-black/30 border border-white/10 rounded-xl px-4 py-3 outline-none focus:bg-black/50 focus:border-white/30 transition-all placeholder-white/30"
          />
          <input
            type="text"
            placeholder="Icon URL (optional)"
            value={newShortcut.iconUrl}
            onChange={(e) => setNewShortcut({...newShortcut, iconUrl: e.target.value})}
            className="bg-black/30 border border-white/10 rounded-xl px-4 py-3 outline-none focus:bg-black/50 focus:border-white/30 transition-all placeholder-white/30"
          />
          <label className="bg-white/10 text-white px-4 py-3 rounded-xl font-semibold hover:bg-white/20 transition-colors cursor-pointer text-center">
            Upload Icon (optional)
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
                  if (result) setNewShortcutIconData(result);
                };
                reader.readAsDataURL(file);
                e.currentTarget.value = '';
              }}
            />
          </label>
          <button 
            onClick={addShortcut}
            className="bg-white text-black mt-2 px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors shadow-lg"
          >
            Add Shortcut
          </button>
        </div>
      )}

      {/* Edit Icon Modal */}
      {editingShortcut && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 glass-panel p-6 rounded-2xl flex flex-col gap-4 animate-fade-in text-white w-[90%] max-w-md shadow-2xl border border-white/20">
          <div className="flex justify-between items-center mb-1">
             <h3 className="font-medium text-lg">Edit Icon</h3>
             <button onClick={() => setEditingShortcut(null)} className="text-white/50 hover:text-white">✕</button>
          </div>
          <input
            type="text"
            placeholder="Icon URL"
            value={editIconUrl}
            onChange={(e) => setEditIconUrl(e.target.value)}
            className="bg-black/30 border border-white/10 rounded-xl px-4 py-3 outline-none focus:bg-black/50 focus:border-white/30 transition-all placeholder-white/30"
          />
          <label className="bg-white/10 text-white px-4 py-3 rounded-xl font-semibold hover:bg-white/20 transition-colors cursor-pointer text-center">
            Upload Icon
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
                  if (result) setEditIconData(result);
                };
                reader.readAsDataURL(file);
                e.currentTarget.value = '';
              }}
            />
          </label>
          <div className="flex gap-2">
            <button
              onClick={saveEditIcon}
              className="bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors shadow-lg flex-1"
            >
              Save Icon
            </button>
            <button
              onClick={clearEditIcon}
              className="bg-red-500/20 text-red-200 px-6 py-3 rounded-xl font-bold hover:bg-red-500/30 transition-colors shadow-lg"
            >
              Remove
            </button>
          </div>
        </div>
      )}
      
      {/* Dim background when editing */}
      {(isEditing || editingShortcut) && (
        <div
          className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={() => {
            setIsEditing(false);
            setEditingShortcut(null);
          }}
        ></div>
      )}
    </div>
  );
};

export default QuickLinks;