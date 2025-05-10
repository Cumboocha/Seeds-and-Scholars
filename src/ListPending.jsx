import CardResto from "./CardResto";

export default function ListPending({setScreen}) {
  return (
    <div className="list-admin-container">
      <h1 className="pending-text">To Approve</h1>
      <CardResto setScreen={setScreen} />
      <CardResto setScreen={setScreen} />
      <CardResto setScreen={setScreen} />
      <CardResto setScreen={setScreen} />
    </div>
  );
}
