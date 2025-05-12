import CardResto from "./CardResto";
import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { firebaseConfig } from "../firebaseConfig";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function ListPending({ onSelectResto }) {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    async function fetchRestaurants() {
      const querySnapshot = await getDocs(collection(db, "restaurants"));
      setRestaurants(
        querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(resto => resto.isAccepted === false) // Only show pending
      );
    }
    fetchRestaurants();
  }, []);

  return (
    <div className="list-admin-container">
      <h1 className="pending-text">To Approve</h1>
      {restaurants.length === 0 ? (
        <p className="results-list">No pending restaurants.</p>
      ) : (
        restaurants.map(resto => (
      <CardResto
        key={resto.id}
        resto={resto}
        onClick={() => onSelectResto && onSelectResto(resto)}
      />
        ))
      )}
    </div>
  );
}
