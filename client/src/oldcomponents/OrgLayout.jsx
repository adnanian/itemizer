import { NavLink, Outlet } from "react-router-dom";
import { navLinkClassName } from "../helpers";
import StyledTitle from "../components/StyledTitle";

export default function OrgLayout( {user} ) {

    if (!user) {
        return <StyledTitle text="Loading..."/>;
    }

    return (
        <>
        <nav id="org-nav">
            <NavLink
                to="/organizations"
                end
                className={navLinkClassName}
            >
                All Organizations
            </NavLink>
            <NavLink
                to={`/organizations/users-memberships/${user.id}`}
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