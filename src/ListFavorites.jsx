import CardResto from "./CardResto";

export default function ListFavorites({ setScreen }) {
  return (
    <div className="list-favs-container">
      <h1 className="favorites-text">Your Favorites</h1>
      <CardResto setScreen={setScreen} />
      <CardResto setScreen={setScreen} />
      <CardResto setScreen={setScreen} />
      <CardResto setScreen={setScreen} />
    </div>
  );
}
