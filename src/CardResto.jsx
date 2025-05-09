export default function CardResto({ setLeftScreen }) {
  return (
    <div className="resto-card" onClick={() => setLeftScreen("resto-profile")}>
      <div className="resto-card-img">
        <img src="assets/resto_default_pfp.png" />
      </div>

      <div className="resto-card-info">
        <h1 className="resto-card-name">Kusinang Bayan</h1>
        <p className="resto-card-desc">
          Isang makabayan at masarap na kainan na naghahain ng mga paboritong
          lutong-bahay tulad ng adobo, siningang, at kare-kare, gamit ang
          sariwang sangkap mula sa palengke
        </p>
      </div>

      <div className="resto-card-arrow">
        <img src="assets/arrow.svg" />
      </div>

      <div className="gen-x-btn-wrapper" onClick={(e) => e.stopPropagation()}>
        <img src="assets/gen_x_btn.png" className="gen-x-btn" />
      </div>
    </div>
  );
}
