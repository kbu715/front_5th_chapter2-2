export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const setItem = (value: T) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      throw new Error(`Failed to save to localStorage: ${error}`);
    }
  };

  const getItem = (): T | null => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      throw new Error(`Failed to get from localStorage: ${error}`);
    }
  };

  const removeItem = () => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      throw new Error(`Failed to remove from localStorage: ${error}`);
    }
  };

  return { setItem, getItem, removeItem };
};
