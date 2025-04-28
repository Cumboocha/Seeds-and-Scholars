import { Link } from "react-router-dom";

export default function NavBar() {
    return (
        <nav className="navbar"> 
            <div className="logo-container"> {/*Logo*/}
                <img className="navbar-logo" src="assets/navbar_logo.png" />
            </div>

            <div className="search-container"> {/*Search Bar*/}
                <input className="search-bar" placeholder="Looking for a specific restaurant?"/>
                <img src="assets/search_symbol.png" />
            </div>
                 
            <div className="button-container"> {/*Buttons*/}
                <div><a href="#"><img src="assets/profile_symbol.png"/></a></div>
                <div>
                    <Link to={"/"}>
                        <img src="assets/logout_symbol.png"/>
                    </Link>
                    </div>
            </div>
        </nav>
    );
}
