export default function CardResto({ resto, setScreen, onClick }) {
  // If onClick is provided, use it; otherwise, fallback to setScreen
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (setScreen) {
      setScreen("resto-profile", resto);
    }
  };

  return (
    <div
      className="resto-card"
      onClick={handleClick}
    >
      <div className="resto-card-img">
        <img src="assets/resto_default_pfp.png" alt="Restaurant" />
      </div>

      <div className="resto-card-info">
        <h1 className="resto-card-name">{resto.name}</h1>
        <p className="resto-card-desc">
          {resto.address}
        </p>
        <p className="resto-card-desc">          
          {resto.contactNumber}
        </p>
      </div>

      <div className="resto-card-arrow">
        <img src="assets/arrow.svg" alt="View" />
      </div>
    </div>
  );
}
