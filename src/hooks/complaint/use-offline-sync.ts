import { useState, useEffect, useCallback } from 'react';

export default function useOfflineSync<T>(
  entityId: number | string | undefined,
  onSync: (data: T) => Promise<void>
) {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingChanges, setPendingChanges] = useState<T[]>(() => {
    if (typeof window !== 'undefined' && entityId) {
      const saved = localStorage.getItem(`pendingChanges-${entityId}`);
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // Check online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Try to submit pending changes when back online
  useEffect(() => {
    if (isOnline && pendingChanges.length > 0 && entityId) {
      const submitPendingChanges = async () => {
        for (const change of pendingChanges) {
          try {
            await onSync(change);
            setPendingChanges(prev => prev.filter(c => c !== change));
          } catch (error) {
            console.error('Failed to submit pending change:', error);
          }
        }
        localStorage.setItem(`pendingChanges-${entityId}`, JSON.stringify(pendingChanges));
      };

      submitPendingChanges();
    }
  }, [isOnline, pendingChanges, entityId, onSync]);

  const addPendingChange = useCallback((change: T) => {
    if (entityId) {
      const newChanges = [...pendingChanges, change];
      setPendingChanges(newChanges);
      localStorage.setItem(`pendingChanges-${entityId}`, JSON.stringify(newChanges));
    }
  }, [pendingChanges, entityId]);

  return {
    isOnline,
    pendingChanges,
    addPendingChange,
    pendingChangesCount: pendingChanges.length
  };
}
