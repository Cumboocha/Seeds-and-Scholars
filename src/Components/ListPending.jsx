import CardResto from "./CardResto";

export default function ListPending({ setScreen }) {
  const userId = sessionStorage.getItem("userId") || localStorage.getItem("userId");

  return (
    <div className="list-admin-container">
      <h1 className="pending-text">To Approve</h1>
      <CardResto setScreen={setScreen} userId={userId} />
      <CardResto setScreen={setScreen} userId={userId} />
      <CardResto setScreen={setScreen} userId={userId} />
      <CardResto setScreen={setScreen} userId={userId} />
    </div>
  );
}
