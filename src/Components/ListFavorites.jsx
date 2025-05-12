import CardResto from "./CardResto";

export default function ListFavorites({ setScreen }) {
  const userId = sessionStorage.getItem("userId") 
  return (
    <div className="list-favs-container">
      <h1 className="favorites-text">Your Favorites</h1>
      <CardResto setScreen={setScreen} userId={userId} />
      <CardResto setScreen={setScreen} userId={userId} />
      <CardResto setScreen={setScreen} userId={userId} />
      <CardResto setScreen={setScreen} userId={userId} />
    </div>
  );
}
