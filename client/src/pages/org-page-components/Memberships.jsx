import JoinedOrgTile from "../../components/JoinedOrgTile";
import StyledTitle from "../../components/StyledTitle";

/**
 * Displays all the organization and membership details that the current user belongs to.
 * Note: to use this component properly, ensure that you pass the membership array from
 * the user instead of ALL memberships to organizations that exist on the server.
 * 
 * @param {Array} memberships THE USER'S MEMBERSHIPS.
 * @returns the user's membership details rendered in JoinedOrgTile components.
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
                    orgId={membership.organization_id}
                    userId={membership.user_id}
                />
            </li>
        )
    })

    return (
        <div id="user-orgs-div">
            <ul id="users-org-list">
                {memberships.length ? usersOrganizations : <StyledTitle text="You currently have no memberships!"/>}
            </ul>
        </div>
    )
}