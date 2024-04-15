import { Link, Outlet } from "react-router-dom";
import NavBar from "./NavBar";

export default function Layout() {
    return (
        <>
            <header>
                <Link className="site-logo" to="/">#ITEMIZER</Link>
                <NavBar/>
            </header>
            <Outlet/>
            <footer>&#169; 2024 #ITEMIZER</footer>
        </>
    )
}