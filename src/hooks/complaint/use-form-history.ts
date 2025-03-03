import { useState, useCallback } from 'react';

export default function useFormHistory<T>(initialData: T) {
  const [history, setHistory] = useState<T[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Function to update data with history tracking
  const updateData = useCallback((newData: T) => {
    // Add current state to history
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(newData);
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
    setHasUnsavedChanges(true);
    return newData;
  }, [history, currentIndex]);

  // Undo function
  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setHasUnsavedChanges(true);
      return history[currentIndex - 1];
    }
    return null;
  }, [currentIndex, history]);

  // Redo function
  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setHasUnsavedChanges(true);
      return history[currentIndex + 1];
    }
    return null;
  }, [currentIndex, history]);

  const resetUnsavedChanges = useCallback(() => {
    setHasUnsavedChanges(false);
  }, []);

  return {
    history,
    currentIndex,
    hasUnsavedChanges,
    updateData,
    undo,
    redo,
    resetUnsavedChanges,
    canUndo: currentIndex > 0,
    canRedo: currentIndex < history.length - 1,
    historyLength: history.length
  };
}
