import StyledTitle from "../components/StyledTitle";
import JoinedOrgTile from "../components/JoinedOrgTile";

export default function Memberships( {memberships} ) {

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
        <div>
            <StyledTitle text="The list of organizations that you belong to."/>
            <ul id="users-org-list">
                {usersOrganizations}
            </ul>
        </div>
    )
}