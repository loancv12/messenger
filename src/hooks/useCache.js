import { useContext } from "react";
import { CacheContext } from "../contexts/CacheProvider";

const useWriteCache = (key, data) => {};

const useGetCache = (key) => {
  const { getCache, setCache, clearCache, deleteCache } =
    useContext(CacheContext);
  return getCache(key);
};
