import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const THEME_OPTIONS = [
  { id: 'dark', name: 'Dark', icon: '🌙', primaryColor: '#06b6d4', bgPreview: '#020617' },
  { id: 'light', name: 'Light', icon: '☀️', primaryColor: '#0284c7', bgPreview: '#f8fafc' },
  { id: 'midnight', name: 'Midnight', icon: '🌌', primaryColor: '#3b82f6', bgPreview: '#090d16' },
  { id: 'ocean', name: 'Ocean', icon: '🌊', primaryColor: '#06b6d4', bgPreview: '#041c24' },
  { id: 'purple', name: 'Purple', icon: '💜', primaryColor: '#a855f7', bgPreview: '#0f0919' }
];

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem('autocompare-theme') || 'dark';
  });

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('autocompare-theme', newTheme);
  };

  useEffect(() => {
    const root = document.documentElement;
    
    // Apply data-theme attribute to <html> element
    root.setAttribute('data-theme', theme);

    // Also toggle .dark or .light class for standard CSS selectors
    if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, THEME_OPTIONS }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
