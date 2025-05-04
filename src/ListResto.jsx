import CardResto from "./CardResto";
import { useState } from "react";

export default function ListResto({ setLeftScreen }) {
    const [currentSort, setCurrentSort] = useState("asc")

    const handleSort = (sort) => setCurrentSort(sort);

  return (
    <div className="resto-list-container">
      <CardResto setLeftScreen={setLeftScreen} />
      <CardResto setLeftScreen={setLeftScreen} />
      <CardResto setLeftScreen={setLeftScreen} />
      <CardResto setLeftScreen={setLeftScreen} />
      <CardResto setLeftScreen={setLeftScreen} />

      <div className="sort-btn-container">
        {currentSort === "asc" && (
            <img src="assets/sort_btn_asc.png" 
            onClick={() => handleSort("desc")} 
            className="sort-btn-asc"/>
        )}

        {currentSort === "desc" && (
            <img src="assets/sort_btn_desc.png" 
            onClick={() => handleSort("asc")} className="sort-btn-desc"/>
        )}
      </div>
    </div>
  );
}
