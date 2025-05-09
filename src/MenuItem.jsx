export default function MenuItem() {
  return (
    <div className="menu-item">
      <div className="menu-item-img">
        <img src="assets/menu_item_default.png" />
      </div>

      <div className="menu-item-info">
        <h1 className="menu-item-name">Adobong Kangkong</h1>
        <p className="menu-item-desc">
          Stir-fried water spinach in soy sauce, vinegar, garlic, and a hint of
          black pepper.
        </p>
      </div>
      <div className="menu-x-btn-wrapper" onClick={(e) => e.stopPropagation()}>
        <img src="assets/gen_x_btn.png" className="menu-x-btn" />
      </div>
    </div>
  );
}
