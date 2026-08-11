import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check } from 'lucide-react';
import { useTheme, THEME_OPTIONS } from '../../context/ThemeContext';

const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef(null);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeThemeObj = THEME_OPTIONS.find((t) => t.id === theme) || THEME_OPTIONS[0];

  return (
    <div className="relative" ref={popoverRef}>
      
      {/* Theme Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-2.5 py-1.5 rounded-xl border border-slate-700/60 bg-slate-800/40 hover:bg-slate-800 text-slate-200 flex items-center gap-1.5 transition-all text-xs font-semibold shadow-sm"
        title="Switch Themes"
      >
        <span className="text-sm">{activeThemeObj.icon}</span>
        <span className="hidden sm:inline font-bold">{activeThemeObj.name}</span>
        <Palette className="w-3.5 h-3.5 text-cyan-400" />
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 glass-panel p-3 rounded-2xl border border-slate-700/80 shadow-2xl z-50 space-y-2 animate-fadeIn">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 px-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-cyan-400" />
              <span>Select Theme</span>
            </span>
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">{theme}</span>
          </div>

          {/* Theme Options List */}
          <div className="space-y-1">
            {THEME_OPTIONS.map((item) => {
              const isSelected = theme === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setTheme(item.id);
                    setIsOpen(false);
                  }}
                  className={`w-full p-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{item.icon}</span>
                    <span>{item.name}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-slate-600 shadow-sm"
                      style={{ backgroundColor: item.primaryColor }}
                    />
                    {isSelected && <Check className="w-4 h-4 text-cyan-400" />}
                  </div>
                </button>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
};

export default ThemeSelector;
