import { Link } from "react-router-dom";

export default function Devs() {
  return (
    <div className="devs-body">
      <div className="our-devs-txt">
        <h1>Our Developers</h1>
        <Link to="/" className="logo-link" viewTransition>
          <img src="assets/devs_back_btn.png" />
        </Link>
      </div>
      <div className="devs-container">
        <div className="dev-container">
          <div className="circle"></div>
          <img src="assets/daryl_pic.png" className="dev-pic" />
          <h2>Daryl Doctora</h2>
          <p>Developer</p>
        </div>

        <div className="dev-container">
          <div className="circle"></div>
          <img src="assets/kevin_pic.png" className="dev-pic" />
          <h2>Kevin Sunga</h2>
          <p>Developer</p>
        </div>

        <div className="dev-container">
          <div className="circle"></div>
          <img src="assets/bea_pic.png" className="dev-pic" />
          <h2>Bea Velasco</h2>
          <p>Developer</p>
        </div>
      </div>
      <img src="assets/coffee.png" className="coffee" />
      <img src="assets/headphones.png" className="headphones" />
    </div>
  );
}
