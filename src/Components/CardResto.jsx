export default function CardResto({ resto, setScreen, userId }) {
    if (userId) {
    sessionStorage.setItem("userId", userId);
  }
  return (
    <div
      className="resto-card"
      onClick={() => setScreen("resto-profile", resto)}
    >
      <div className="resto-card-img">
        <img src="assets/resto_default_pfp.png" alt="Restaurant" />
      </div>

      <div className="resto-card-info">
        <h1 className="resto-card-name">{resto.name}</h1>
        <p className="resto-card-desc">
          {resto.description}
        </p>
      </div>

      <div className="resto-card-arrow">
        <img src="assets/arrow.svg" alt="View" />
      </div>
    </div>
  );
}
