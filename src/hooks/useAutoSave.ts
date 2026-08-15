import { useEffect, useState, useRef } from 'react';

export interface AutoSaveState {
  isSaving: boolean;
  lastSavedAt: number | null;
  statusText: string;
}

export function useAutoSave<T>(dataToSave: T, saveFn: (data: T) => void, intervalMs: number = 30000) {
  const [saveState, setSaveState] = useState<AutoSaveState>({
    isSaving: false,
    lastSavedAt: Date.now(),
    statusText: '💾 SAVED',
  });

  const dataRef = useRef(dataToSave);
  dataRef.current = dataToSave;

  const isInitial = useRef(true);

  // Trigger save whenever data changes with a slight debounce
  useEffect(() => {
    if (isInitial.current) {
      isInitial.current = false;
      return;
    }

    setSaveState((prev) => ({ ...prev, isSaving: true, statusText: '💾 SAVING...' }));

    const timer = setTimeout(() => {
      saveFn(dataRef.current);
      setSaveState({
        isSaving: false,
        lastSavedAt: Date.now(),
        statusText: '💾 SAVED',
      });
    }, 800);

    return () => clearTimeout(timer);
  }, [dataToSave, saveFn]);

  // Periodic interval save
  useEffect(() => {
    const interval = setInterval(() => {
      saveFn(dataRef.current);
      setSaveState({
        isSaving: false,
        lastSavedAt: Date.now(),
        statusText: '💾 SAVED',
      });
    }, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMs, saveFn]);

  return saveState;
}
