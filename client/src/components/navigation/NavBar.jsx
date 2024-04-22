import { NavLink } from "react-router-dom";
import { navLinkClassName } from "../../helpers";

function NavBar({ user, setUser }) {

    async function handleLogoutClick() {
        const response = await fetch("/api/logout", {
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
                            to={`/organizations/user/${user.id}`}
                            className={navLinkClassName}
                        >
                            Organizations
                        </NavLink>
                        <NavLink
                            to="/settings"
                            className={navLinkClassName}
                        >
                            Settings
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