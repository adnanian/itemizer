import { NavLink } from "react-router-dom";

function NavBar() {
    const navLinkClassName = "nav-link"

    return (
        <nav className="navigation">
            <NavLink
                to="/"
                className={navLinkClassName}
            >
                Home
            </NavLink>
            <NavLink
                to="/signup"
                className={navLinkClassName}
            >
                Signup
            </NavLink>
        </nav>
    );
}

export default NavBar;