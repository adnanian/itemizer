import { NavLink, /*useNavigate*/ } from "react-router-dom";
import { navLinkClassName } from "../../helpers";
//import { useEffect } from "react";

/**
 * TODO
 * 
 * @param {*} param0 
 * @returns 
 */
function NavBar({ user, onLogout }) {
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