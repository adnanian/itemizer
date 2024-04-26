import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Memberships from "./Memberships";
import OrganizationsTable from "./OrganizationsTable"
import StyledTitle from "../components/StyledTitle";


/**
 * TODO
 * 
 * Create an Organization
 * 
 */

/**
 * TODO
 * 
 * @returns 
 */
export default function OrganizationsPage() {
    const params = useParams();
    const [user, setUser] = useState(null);
    const [organizations, setOrganizations] = useState([]);
    const [orgFilter, setOrgFilter] = useState(false);

    useEffect(() => {
        if (!params) {
            setUser(null);
        } else {
            fetch(`/api/users/${params.id}`)
            .then((response) => response.json())
            .then((data) => setUser(data));
        }
    }, [params])

    useEffect(() => {
        fetch('/api/organizations')
        .then((response) => response.json())
        .then((data) => setOrganizations(data));
    }, [])

    if (!user) {
        return <StyledTitle text="Loading user..." />
    }

    //console.log(user);

    return (
        <main>
            <div id="org-radio" className="radio-group">
                <input
                    id="table"
                    name="table"
                    type="radio"
                    value="All Organizations"
                    onChange={(e) => setOrgFilter(false)}
                    checked={!orgFilter}
                />
                <span>All Organizations</span>
                <input
                    id="filter-grid"
                    name="filter-grid"
                    type="radio"
                    value="My Organizations"
                    onChange={(e) => setOrgFilter(true)}
                    checked={orgFilter}
                />
                <span>My Organizations</span>
            </div>
            <button id="org-create">Create an organization</button>
            {
                orgFilter 
                ? <Memberships memberships={user.memberships}/>
                : <OrganizationsTable user={user} organizations={organizations}/>
            }
        </main>
    );
}