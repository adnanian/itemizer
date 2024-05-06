import { Link, Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import '../../styles/Layout.css';

/**
 * The header and the component tied to the route clicked.
 * The header contains all the navigational links and whatever page the user is currently viewing.
 * The page viewed is being rendered with an outlet context.
 * Also includes a footer, that needs further development.
 * Note: the home link is rendered DIRECTLY under the header element instead of in the NavBar component.
 * 
 * @param {Object} props 
 * @param {Object} props.user the current user.
 * @param {Function} props.onLogout the callback function to execute when logging out.
 * @returns the navigatinal header and the outlet page (the current page).
 */
export default function Layout( {user, onLogout} ) {
    return (
        <>
            <header>
                <Link id="site-logo" to="/">
                    <div className="logo">
                        <img className="logo" src="/itemizer-logo.jpg" alt="#ITEMIZER"/>
                        <span className="logo">ITEMIZER</span>
                    </div>
                </Link>
                <NavBar user={user} onLogout={onLogout} />
            </header>
            <Outlet/>
            <footer><b>&#169; 2024 #ITEMIZER</b></footer>
        </>
    )
}