import React, { createContext, useContext, useState, useEffect } from 'react';

const CompareContext = createContext();

const STORAGE_KEY = 'autocompare_selected_ids';
const MAX_COMPARE_LIMIT = 4;

export const CompareProvider = ({ children }) => {
  const [selectedIds, setSelectedIds] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedIds));
    } catch (e) {
      console.error('Failed saving compare list to localStorage', e);
    }
  }, [selectedIds]);

  const addToCompare = (id) => {
    if (!id) return false;
    if (selectedIds.includes(id)) return true;
    if (selectedIds.length >= MAX_COMPARE_LIMIT) {
      alert(`Compare up to ${MAX_COMPARE_LIMIT} vehicles at a time.`);
      return false;
    }
    setSelectedIds((prev) => [...prev, id]);
    return true;
  };

  const removeFromCompare = (id) => {
    setSelectedIds((prev) => prev.filter((item) => item !== id));
  };

  const toggleCompare = (id) => {
    if (selectedIds.includes(id)) {
      removeFromCompare(id);
    } else {
      addToCompare(id);
    }
  };

  const clearCompare = () => {
    setSelectedIds([]);
  };

  const isInCompare = (id) => selectedIds.includes(id);

  return (
    <CompareContext.Provider
      value={{
        selectedIds,
        addToCompare,
        removeFromCompare,
        toggleCompare,
        clearCompare,
        isInCompare,
        maxLimit: MAX_COMPARE_LIMIT,
        isFull: selectedIds.length >= MAX_COMPARE_LIMIT
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};
