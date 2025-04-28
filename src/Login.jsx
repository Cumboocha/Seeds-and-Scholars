import { Link } from "react-router-dom";

export default function Login({onLoginClose}) {
    return (
        <div className="login-body">
            {/*Left Side*/}
            <div className="login-container">
                <img src="assets/login_bg.png" />
                <form>
                    <input placeholder="Email"/>
                    <input placeholder="Password"/>
                    <Link to={"dashboard"}>
                        <button>&nbsp;LOG IN</button>
                    </Link>
                </form>
            </div>

            {/*Right Side*/}
            <div className="login-logo-container">
                <a href="#" onClick={onLoginClose}>
                    <img className="login-x-btn" src="assets/login_x_btn.png" />
                </a>
                <img src="assets/login_logo.png"/>
            </div>
        </div>
    );
}