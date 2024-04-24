import StyledTitle from "../components/StyledTitle";
import { tableRowClassName } from "../helpers";

/**
 * TODO
 * 
 * @param {*} param0 
 * @returns 
 */
export default function Organizations( {user, organizations} ) {

    if (!organizations) {
        return <StyledTitle text="Loading organizations..."/>;
    }

    const orgRows = organizations.map((organization, orgIndex) => {
        const owner = organization.memberships.filter((member) => member.role === "OWNER")[0].user.username;
        const admins = organization.memberships.filter((member) => member.role === "ADMIN");
        const userIsMember = organization.memberships.filter((member) => member.user_id === user.id).length;

        //console.log(owner);

        return (
          <tr key={organization.id} className={tableRowClassName(orgIndex + 1)}>
            <td>{orgIndex + 1}</td>
            <td>{organization.name}</td>
            <td>{owner}</td>
            <td>{admins.length}</td>
            <td>{organization.memberships.length}</td>
            <td>{organization.description}</td>
            <td>
                {
                    userIsMember
                    ? <span className="is-member">You are a member!</span>
                    : <button className="join-button">Request to join!</button>
                }
            </td>
          </tr>  
        );
    });

    return (
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
    );
}