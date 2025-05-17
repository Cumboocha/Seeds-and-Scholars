import CardResto from "./CardResto";
import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { firebaseConfig } from "../firebaseConfig";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function ListPending({ onSelectResto }) {
  const [restaurants, setRestaurants] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const restosPerPage = 10;

  useEffect(() => {
    async function fetchRestaurants() {
      const querySnapshot = await getDocs(collection(db, "restaurants"));
      setRestaurants(
        querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(resto => resto.isAccepted === false)
      );
    }
    fetchRestaurants();
  }, []);

  const indexOfLastResto = currentPage * restosPerPage;
  const indexOfFirstResto = indexOfLastResto - restosPerPage;
  const currentRestos = restaurants.slice(indexOfFirstResto, indexOfLastResto);
  const totalPages = Math.ceil(restaurants.length / restosPerPage);

  return (
    <div className="list-admin-container">
      <h1 className="pending-text">To Approve</h1>
      {restaurants.length === 0 ? (
        <div className="no-est-found">
          <img src="assets/nothing_here.png"/>
        </div>
      ) : (
        <>
          {currentRestos.map(resto => (
            <CardResto
              key={resto.id}
              resto={resto}
              onClick={() => onSelectResto && onSelectResto(resto)}
            />
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
