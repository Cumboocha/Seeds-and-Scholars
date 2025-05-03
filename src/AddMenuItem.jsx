export default function AddMenuItem({handleMenuClose, handleMenuAdd}) {
  return (
    <div className="add-menu-item-body">
      <h1> Add Menu Item </h1>
      <div className="menu-item-form">
        <div className="menu-item-img">
          <img src="assets/menu_item_default.png" />
        </div>

        <div className="menu-item-form-info">
          <input placeholder="Item Name" />
          <textarea placeholder="Item Description" />
        </div>
      </div>
      <div className="add-item-btns-container">
        <button className="add-menu-submit-btn" onClick={handleMenuClose}>&nbsp;CANCEL</button>
        <button className="add-menu-submit-btn" onClick={handleMenuAdd}>&nbsp;&nbsp; ADD &nbsp;&nbsp;</button>
      </div>
    </div>
  );
}
