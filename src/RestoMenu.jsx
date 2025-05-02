import MenuItem from "./MenuItem";

export default function RestoMenu() {
  return (
    <div className="resto-container-white-part">
      <MenuItem />
      <div className="add-item-container">
        <p> + </p>
      </div>
    </div>
  );
}
