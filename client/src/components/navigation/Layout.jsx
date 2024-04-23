import { Link, Outlet } from "react-router-dom";
import NavBar from "./NavBar";

/**
 * TODO
 * 
 * @param {*} param0 
 * @returns 
 */
export default function Layout( {user, setUser} ) {
    return (
        <>
            <header>
                <Link id="site-logo" to="/">
                    <div className="logo">
                        <img className="logo" src="/itemizer-logo.jpg" alt="#ITEMIZER"/>
                        <span className="logo">ITEMIZER</span>
                    </div>
                </Link>
                <NavBar user={user} setUser={setUser} />
            </header>
            <Outlet/>
            <footer><b>&#169; 2024 #ITEMIZER</b></footer>
        </>
    )
}