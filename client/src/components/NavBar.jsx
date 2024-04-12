import { NavLink } from "react-router-dom";

const NavBar = () => {
    return (
        <nav className="navigation">
            <NavLink
                to="/"
                className="nav-link"
            />
            <NavLink
                to="/api/signup"
                className="nav-link"
            />
        </nav>
    );
}

export default NavBar;