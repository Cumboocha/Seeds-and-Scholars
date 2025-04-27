export default function Login({onLoginClose, onLogin}) {
    return (
        <div className="login-body">
            {/*Left Side*/}
            <div className="login-container">
                <img src="assets/login_bg.png" />
                <form>
                    <input placeholder="Email"/>
                    <input placeholder="Password"/>
                    <button onClick={onLogin}>&nbsp;LOG IN</button>
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