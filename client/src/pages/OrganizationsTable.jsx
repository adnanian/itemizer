import StyledTitle from "../components/StyledTitle";
import { hasNothingness, tableRowClassName } from "../helpers";


/**
 * TODO
 * 
 * Request to join!
 * 
 */

/**
 * TODO
 * 
 * @param {*} param0 
 * @returns 
 */
export default function OrganizationsTable( {user, organizations} ) {

    if (hasNothingness(user, organizations)) {
        return <StyledTitle text="Loading organizations..."/>;
    }

    const requestForOrgIds = user.requests.map((request) => request.organization_id);

    const orgRows = organizations.map((organization, orgIndex) => {
        const owner = organization.memberships.find((member) => member.role === "OWNER").user.username;
        let adminCount = 0;
        organization.memberships.forEach((membership) => {
            if (membership.role === "ADMIN") {
                adminCount++;
            }
        });
        //const userIsMember = organization.memberships.filter((member) => member.user_id === user.id).length;
        const membershipStatus = () => {
            const userMember = organization.memberships.find((membership) => membership.user_id === user.id);
            if (userMember) {
                return <span className="is-member">You are a member!</span>
            }
            if (requestForOrgIds.includes(organization.id)) {
                return <span className="pending">Membership Request Pending</span>
            }
            return <button className="join-button">Request to join!</button>
        };
        //console.log(owner);

        return (
          <tr key={organization.id} className={tableRowClassName(orgIndex + 1)}>
            <td>{orgIndex + 1}</td>
            <td>{organization.name}</td>
            <td>{owner}</td>
            <td>{adminCount}</td>
            <td>{organization.memberships.length}</td>
            <td>{organization.description}</td>
            <td>{membershipStatus()}</td>
          </tr>  
        );
    });

    return (
        <div className="table-container">
            <table id="org-table">
            <thead>
                <tr>
                    <th>Org #</th>{/** ROW # IN TABLE; NOT THE ID  */}
                    <th>Name</th>
                    <th>Owner</th>
                    <th>Admins</th>
                    <th>Members</th>
                    <th>About</th>
                    <th>Are you a member?</th>
                </tr>
            </thead>
            <tbody>
                {orgRows}
            </tbody>
            </table>
        </div>
    );
}