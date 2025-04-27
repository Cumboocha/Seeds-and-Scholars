export default function Landing({ onLoginBtnClick, onSignupBtnClick }) {
    return (
        <div className="landing-body">
            <div className="landing-side">
                <img src="assets/landing_logo_icon_mini.png" />
            </div>
            <div className="landing-elements">
                <img src="assets/landing_logo.png"/>

                <div className="landing-buttons">
                    <button className="login-btn" onClick={onLoginBtnClick}>&nbsp;LOG IN</button>
                    <button className="signup-btn" onClick={onSignupBtnClick}>&nbsp;SIGN UP</button>
                </div>
            </div>
        </div>
    );
}