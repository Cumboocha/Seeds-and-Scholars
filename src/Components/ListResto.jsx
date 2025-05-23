import CardResto from "./CardResto";
import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { firebaseConfig } from "../firebaseConfig";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const PAGE_SIZE = 10;

export default function ListResto({ onscreenChange, searchTerm }) {
  const userId = sessionStorage.getItem("userId");
  const [restaurants, setRestaurants] = useState([]);
  const [currentSort, setCurrentSort] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchRestaurants() {
      const querySnapshot = await getDocs(collection(db, "restaurants"));
      setRestaurants(
        querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(resto => resto.isAccepted === true)
      );
    }
    fetchRestaurants();
  }, []);

  useEffect(() => {
    setCurrentPage(1); 
  }, [searchTerm]);

  const handleSort = (order) => {
    setCurrentSort(order);
    setCurrentPage(1); 
  };

  const filteredRestaurants = searchTerm
    ? restaurants.filter(resto =>
        resto.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : restaurants;

  const sortedRestaurants = [...filteredRestaurants].sort((a, b) => {
    if (currentSort === "asc") {
      return a.name.localeCompare(b.name);
    } else {
      return b.name.localeCompare(a.name);
    }
  });

  const totalPages = Math.max(1, Math.ceil(sortedRestaurants.length / PAGE_SIZE));
  const paginatedRestaurants = sortedRestaurants.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handlePrevPage = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNextPage = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  return (
    <div className="resto-list-container">
      <p className="establishments-text">Establishments</p>
      <div className="resto-list-summary">
        {filteredRestaurants.length === 0 ? (
          <span>No restaurants found{searchTerm && ` for "${searchTerm}"`}.</span>
        ) : (
          <span className="results-list">
            Showing {paginatedRestaurants.length} result
            {paginatedRestaurants.length !== 1 && "s"}
            {searchTerm && ` for "${searchTerm}"`}
            {" sorted "}
            {currentSort === "asc" ? "A-Z" : "Z-A"}
            {" (Page "}{currentPage} of {totalPages}{")"}
          </span>
        )}
      </div>
      {paginatedRestaurants.map(resto => (
        <CardResto key={resto.id} resto={resto} setScreen={onscreenChange} userId={userId}/>
      ))}
      <div className="sort-btn-container">
        {currentSort === "asc" && (
          <img
            src="assets/sort_btn_asc.png"
            onClick={() => handleSort("desc")}
            className="sort-btn-asc"
            alt="Sort Z-A"
            style={{ cursor: "pointer" }}
          />
        )}
        {currentSort === "desc" && (
          <img
            src="assets/sort_btn_desc.png"
            onClick={() => handleSort("asc")}
            className="sort-btn-desc"
            alt="Sort A-Z"
            style={{ cursor: "pointer" }}
          />
        )}
      </div>
      <div className="pagination-controls">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          &lt;
        </button>
        <span style={{ margin: "0 8px" }}>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          &gt;
        </button>
      </div>
    </div>
  );
}