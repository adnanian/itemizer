import { NavLink } from "react-router-dom";
import { navLinkClassName } from "../../helpers";

export default function OrgLayout() {
    return (
        <nav>
            <NavLink
                to="/organizations"
                end
                className={navLinkClassName}
            >
                All Organizations
            </NavLink>
            <NavLink
                to="/organizations/:id"
                end
                className={navLinkClassName}
            >
                My Organizations
            </NavLink>
        </nav>
    )
}