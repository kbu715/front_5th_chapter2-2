import { useState, useCallback } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const isClient = typeof window !== "undefined";

  const [storedValue, setStoredValue] = useState<T>(() => {
    if (!isClient) return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`useLocalStorage [get] issue for key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        if (isClient) {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.warn(`useLocalStorage [set] issue for key "${key}":`, error);
      }
    },
    [key, storedValue, isClient]
  );

  return [storedValue, setValue] as const;
}
