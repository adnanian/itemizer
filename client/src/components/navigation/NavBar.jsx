import { NavLink } from "react-router-dom";

function NavBar() {
    const navLinkClassName = "nav-link"

    return (
        <nav className="navigation">
            <NavLink
                to="/about"
                className={navLinkClassName}
            >
                About
            </NavLink>
            <NavLink
                to="/login"
                className={navLinkClassName}
            >
                Login
            </NavLink>
        </nav>
    );
}

export default NavBar;