export default function Login({onSignupClose}) {
    return (
        <div className="signup-body">
            {/*Left Side*/}
            <div className="signup-logo-container">
                <a href="#" onClick={onSignupClose}>
                    <img className="signup-x-btn" src="assets/signup_x_btn.png" />
                </a>
                <img src="assets/signup_logo.png"/>
            </div>
        
            {/*Right Side*/}
            <div className="signup-container">
                <img src="assets/signup_bg.png" />
                <form>
                    <div className="first-last-name-row">
                        <input placeholder="First Name*"/>
                        <input placeholder="Last Name*"/>
                    </div>
                    
                    <input placeholder="Email*"/>
                    <input placeholder="Password*"/>
                    <input placeholder="Confirm Password*"/>
                    <button>&nbsp;SIGN UP</button>
                </form>
            </div>
        </div>
    );
}