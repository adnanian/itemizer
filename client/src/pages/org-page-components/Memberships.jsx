import JoinedOrgTile from "../../components/JoinedOrgTile";
import StyledTitle from "../../components/StyledTitle";

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