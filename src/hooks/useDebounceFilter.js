import React, { useCallback, useEffect, useState } from "react";
import { debounce } from "../utils/debounce";

const useDebounceFilter = (list, keyFilter) => {
  const [query, setQuery] = useState("");
  const [filteredList, setFilteredList] = useState(list);

  const filterList = (query) => {
    const result = list.filter((el) => {
      return el[keyFilter].toLowerCase().includes(query.toLowerCase());
    });

    setFilteredList(result);
  };

  const debounceFilter = useCallback(debounce(filterList, 500), [
    list,
    keyFilter,
  ]);

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  useEffect(() => {
    debounceFilter(query);
  }, [query, debounceFilter]);

  return { query, setFilteredList, handleChange, filteredList };
};

export default useDebounceFilter;
