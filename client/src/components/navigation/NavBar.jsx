import { NavLink, /*useNavigate*/ } from "react-router-dom";
import { navLinkClassName } from "../../helpers";
//import { useEffect } from "react";

/**
 * A navigational bar. If there is no user currently logged in, then
 * only the navigational links for the About page and Login page will be 
 * rendered. Otherwise, the header will show a navigational link for
 * the About, Organizations, and Settings page. In addition to this,
 * a navigational link that says "Logout", which redirects the user
 * back to the login page, will be shown.
 * 
 * @param {Object} props 
 * @param {Object} props.user the current user.
 * @param {Function} props.onLogout the callback function to execute to logout of the current user's account.
 * @returns a nav bar.
 */
function NavBar({ user, onLogout }) {

    // For later use.
    /*
    const navigate = useNavigate();
    async function automaticLogout() {
        navigate("/login")
    }
    */
    

    /*
    useEffect(() => {
        if (user) {
            const inactivityTime = 10000;
            const timer = setTimeout(async () => {
                await automaticLogout();
                await handleLogoutClick();
                alert(`You have been logged out after ${inactivityTime} ms of inactivity.`);
            }, inactivityTime);

            return () => clearTimeout(timer);
        }
    }, [user]);
    */

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
                            to={"/organizations"}
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
                            onClick={onLogout}
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