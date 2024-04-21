import { NavLink, Outlet } from "react-router-dom";
import { navLinkClassName } from "../../helpers";

export default function OrgLayout( {user} ) {
    return (
        <>
        <nav>
            <NavLink
                to="/organizations"
                end
                className={navLinkClassName}
            >
                All Organizations
            </NavLink>
            <NavLink
                to={`/organizations/${user.id}`}
                end
                className={navLinkClassName}
            >
                My Organizations
            </NavLink>
        </nav>
        <Outlet/>
        </>
    )
}