import { useParams } from "react-router-dom";
import StyledTitle from "../components/StyledTitle";
import { useEffect, useState } from "react";
import JoinedOrgTile from "../components/JoinedOrgTile";

export default function Memberships() {
    const params = useParams();
    const [memberships, setMemberships] = useState([]);

    useEffect(() => {
        if (params !== null) {
            fetch(`/api/users/${params.id}`)
            .then((response) => response.json())
            .then((user) => {
                console.log(user);
                setMemberships(user.memberships);
            });
        } else {
            setMemberships(null);
        }
    }, [params]);

    const usersOrganizations = memberships.map((membership) => {
        return (
            <li key={membership.id}>
                <JoinedOrgTile
                    name={membership.organization.name}
                    description={membership.organization.description}
                    created={membership.organization.created}
                    joined={membership.joined}
                    role={membership.role}
                    id={membership.organization_id}
                />
            </li>
        )
    })

    return (
        <main>
            <button id="org-create">Create an organization</button>
            <StyledTitle text="The list of organizations that you belong to."/>
            <ul id="users-org-list">
                {usersOrganizations}
            </ul>
        </main>
    )
}