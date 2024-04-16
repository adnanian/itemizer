import { Link, Outlet } from "react-router-dom";
import NavBar from "./NavBar";

export default function Layout( {user, setUser} ) {
    return (
        <>
            <header>
                <Link id="site-logo" to="/">#ITEMIZER</Link>
                <NavBar user={user} setUser={setUser} />
            </header>
            <Outlet/>
            <footer><b>&#169; 2024 #ITEMIZER</b></footer>
        </>
    )
}