import CardResto from "./CardResto";
import { useState } from "react";

export default function ListFavorites({
  favorites = [],
  loading,
  onSelectResto,
}) {
  const userId = sessionStorage.getItem("userId");
  const [currentPage, setCurrentPage] = useState(1);
  const restosPerPage = 4;

  const indexOfLastResto = currentPage * restosPerPage;
  const indexOfFirstResto = indexOfLastResto - restosPerPage;
  const currentRestos = favorites.slice(indexOfFirstResto, indexOfLastResto);
  const totalPages = Math.ceil(favorites.length / restosPerPage);

  return (
    <div >
      <h1 className="favorites-text">Your Favorites</h1>
      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      ) : favorites.length === 0 ? (
        <div className="no-est-found">
          <img src="assets/no_establishment_found.png" />
        </div>
      ) : (
        <>
          {currentRestos.map((resto) => (
            <div
              key={resto.id}
              onClick={() => onSelectResto(resto)}
              style={{ cursor: "pointer" }}
            >
              <CardResto
                resto={resto}
                userId={userId}
              />
            </div>
          ))}
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              &lt;
            </button>
            <span style={{ margin: "0 10px" }}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
          </div>
        </>
      )}
    </div>
  );
}
