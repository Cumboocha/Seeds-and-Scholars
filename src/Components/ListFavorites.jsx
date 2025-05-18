import CardResto from "./CardResto";

export default function ListFavorites({ favorites = [], loading, onSelectResto }) {
  const userId = sessionStorage.getItem("userId");
  return (
    <div className="list-favs-container">
      <h1 className="favorites-text">Your Favorites</h1>
      {loading ? (
        <div className="spinner"></div>
      ) : favorites.length === 0 ? (
        <div className="no-est-found">
          <img src="assets/no_establishment_found.png"/>
        </div>
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
