import CardResto from "./CardResto";

export default function ListFavorites({ favorites = [], loading, onSelectResto }) {
  const userId = sessionStorage.getItem("userId");
  return (
    <div className="list-favs-container">
      <h1 className="favorites-text">Your Favorites</h1>
      {loading ? (
        <p>Loading...</p>
      ) : favorites.length === 0 ? (
        <p>No favorites yet.</p>
      ) : (
        favorites.map((resto) => (
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
        ))
      )}
    </div>
  );
}
