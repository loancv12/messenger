// import React, { useState, useEffect, useCallback } from "react";
// import { debounce } from "../../utils/debounce";

// const DebouncedFilter = ({ data, comp }) => {
//   const [query, setQuery] = useState("");
//   const [filteredData, setFilteredData] = useState(data);

//   // Filter function
//   const filterData = (query) => {
//     const result = data.filter((item) =>
//       item.toLowerCase().includes(query.toLowerCase())
//     );
//     setFilteredData(result);
//   };

//   // Debounced version of the filter function
//   const debouncedFilter = useCallback(debounce(filterData, 300), [data]);

//   useEffect(() => {
//     debouncedFilter(query);
//   }, [query, debouncedFilter]);

//   const handleChange = (e) => {
//     setQuery(e.target.value);
//   };

//   const Component=comp

//   return (
//     <div>
//       <input
//         type="text"
//         value={query}
//         onChange={handleChange}
//         placeholder="Search..."
//       />
//       <ul>
//         {filteredData.map((item, index) => (
//           <Component key={index} {...item}/>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default DebouncedFilter;
