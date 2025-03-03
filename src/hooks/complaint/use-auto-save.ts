import { useState, useEffect, useCallback } from 'react';

interface AutoSaveOptions {
  onSave: () => void;
  hasUnsavedChanges: boolean;
  intervalMs?: number;
  keyboardShortcut?: boolean;
}

export default function useAutoSave({
  onSave,
  hasUnsavedChanges,
  intervalMs = 10000,
  keyboardShortcut = true
}: AutoSaveOptions) {
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('autoSaveEnabled') !== 'false';
    }
    return true;
  });
  
  const [lastSaveTime, setLastSaveTime] = useState(Date.now());

  // Toggle autosave
  const toggleAutoSave = useCallback(() => {
    setAutoSaveEnabled((prev) => {
      const newValue = !prev;
      localStorage.setItem('autoSaveEnabled', String(newValue));
      return newValue;
    });
  }, []);

  // Update last save time
  const updateLastSaveTime = useCallback(() => {
    setLastSaveTime(Date.now());
  }, []);

  // Auto-save every X seconds if enabled and there are changes
  useEffect(() => {
    if (!autoSaveEnabled) return;

    const autoSaveInterval = setInterval(() => {
      if (hasUnsavedChanges && Date.now() - lastSaveTime >= intervalMs) {
        onSave();
      }
    }, intervalMs);

    return () => clearInterval(autoSaveInterval);
  }, [hasUnsavedChanges, lastSaveTime, onSave, autoSaveEnabled, intervalMs]);

  // Handle Ctrl+S
  useEffect(() => {
    if (!keyboardShortcut) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        onSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSave, keyboardShortcut]);

  // Handle before unload
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  return {
    autoSaveEnabled,
    toggleAutoSave,
    lastSaveTime,
    updateLastSaveTime,
    timeUntilNextSave: Math.max(
      0,
      Math.ceil((intervalMs - (Date.now() - lastSaveTime)) / 1000)
    )
  };
}
