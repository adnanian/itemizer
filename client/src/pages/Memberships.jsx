import JoinedOrgTile from "../components/JoinedOrgTile";

/**
 * TODO
 * 
 * @param {*} param0 
 * @returns 
 */
export default function Memberships( {memberships} ) {

    // TODO
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
        <div id="user-orgs-div">
            <ul id="users-org-list">
                {usersOrganizations}
            </ul>
        </div>
    )
}