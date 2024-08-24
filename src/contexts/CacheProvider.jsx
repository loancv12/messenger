import { createContext } from "react";

export const CacheContext = createContext();

export default function CacheProvider({ children }) {
  const map = new Map();

  async function getCache(key) {
    const cacheValue = map.get(key);

    if (!cacheValue) return undefined;

    return cacheValue.data;
  }

  function setCache(key, value) {
    map.set(key, {
      data: value,
    });
  }

  function clearCache() {
    map.clear();
  }

  function deleteCache(key) {
    map.delete(key);
  }

  const contextValue = {
    getCache,
    setCache,
    clearCache,
    deleteCache,
  };

  return (
    <CacheContext.Provider value={contextValue}>
      {children}
    </CacheContext.Provider>
  );
}
