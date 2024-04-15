import { Link, Outlet } from "react-router-dom";
import NavBar from "./NavBar";

export default function Layout() {
    return (
        <>
            <header>
                <Link id="site-logo" to="/">#ITEMIZER</Link>
                <NavBar/>
            </header>
            <Outlet/>
            <footer><b>&#169; 2024 #ITEMIZER</b></footer>
        </>
    )
}