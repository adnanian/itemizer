import { NavLink } from "react-router-dom";

function NavBar({ user, setUser }) {
    const navLinkClassName = "nav-link"

    async function handleLogoutClick() {
        const response = await fetch("http://127.0.0.1:5555/api/logout", {
            method: "DELETE"
        });
        if (response.ok) {
            setUser(null);
        }
    }

    return (
        <nav className="navigation">
            <NavLink
                to="/about"
                className={navLinkClassName}
            >
                About
            </NavLink>
            {
                user ? (
                    <>
                        <NavLink
                            to="/organizations"
                            className={navLinkClassName}
                        >
                            Organizations
                        </NavLink>
                        <NavLink
                            to="/login"
                            className={navLinkClassName}
                            onClick={handleLogoutClick}
                        >
                            Logout
                        </NavLink>
                    </>
                ) : (
                    <NavLink
                        to="/login"
                        className={navLinkClassName}
                    >
                        Login
                    </NavLink>
                )
            }
        </nav>
    );
}

export default NavBar;