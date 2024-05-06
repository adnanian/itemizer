import { tableRowClassName } from "../../../helpers";

/**
 * Displays a modal table of all the members in the organization currently
 * being viewed. If the current use is a non-REGULAR, then he/she will be
 * able to manage user access.
 * 
 * Each row in the table includes their name, username, email address, the date they joined,
 * and their role.
 * 
 * @param {Object} props 
 * @param {Array} props.members the members of the organization.
 * @param {Object} props.userMember the current user viewing the organization.
 * @param {Function} props.onDelete the callback function to execute upon deleting the user from the organization on the server side.
 * @param {Function} props.onUpdate the callback function to execute to update a user's role in the organization on the server side.
 * @returns a modal table of all members of the organization.
 */
export default function MembersTable({ members, userMember, onDelete, onUpdate }) {

    /**
     * Removes a user from the organization.
     * An ADMIN can remove either a REGULAR or another ADMIN, but never the OWNER.
     * An OWNER can only be removed by choosing to leave the organization.
     * @see ConfirmLeave component for more details.
     * 
     * @param {Integer} id the id of the user's membership.
     */
    async function handleExpel(id) {
        const memberToDelete = members.find((member) => member.id === id);
        const response = await fetch(`/api/memberships/${id}`, {
            method: "DELETE"
        });
        if (response.ok) {
            onDelete(memberToDelete);
            //console.log(response);
            //notify("User removed!");
            alert(`User, ${memberToDelete.user.username} has been removed from the organization!`);
        }
    }

    /**
     * Updates a user's role in the organization.
     * A user can either be promoted to ADMIN or demoted to REGULAR.
     * A user can never be promoted to an OWNER, unless the current OWNER leaves the organization and transfers ownership to that user.
     * An OWNER can never be demoted
     * 
     * @param {Integer} id the user's membership id.
     * @param {String} oldRole the user's current role in the organization.
     * @param {String} newRole the user's new role in the organization.
     */
    function handleRoleChange(id, oldRole, newRole) {
        const verb = newRole === "ADMIN" ? "promoted" : "demoted";
        fetch(`/api/memberships/${id}`, {
            method: "PATCH",
            headers: {"Content-Type": "Application/json"},
            body: JSON.stringify({
                role: newRole
            })
        })
        .then((response) => response.json())
        .then((member) => {
            onUpdate(member);
            alert(`User, ${member.user.username}, has been ${verb} from ${oldRole} to ${newRole}!`);
        })
        .catch((error) => {
            console.error('Network error:', error);
        })
    }

    const memberRows = members.map((member, memberIndex) => {
        let rowClass;
        if (userMember.role === "OWNER" && member.user_id == userMember.user_id) {
            rowClass = "youre-the-owner";
        } else if (member.role === "OWNER") {
            rowClass = "owner";
        } else if (member.user_id == userMember.user_id) {
            rowClass = "you";
        } else {
            rowClass = tableRowClassName(memberIndex + 1);
        }
        const roleChangeText = member.role === "REGULAR" ? "Promote" : "Demote";
        const oppositeRole = member.role === "REGULAR" ? "ADMIN" : "REGULAR";
        const roleChangteTooltip = `${roleChangeText} user, ${member.user.username} from ${member.role} to ${oppositeRole}.`

        return (
            <tr key={member.id} className={rowClass}>
                <td>{memberIndex + 1}</td>
                <td>{member.user.first_name}</td>
                <td>{member.user.last_name}</td>
                <td>{member.user.username}</td>
                <td>{member.user.email}</td>
                <td>{member.joined}</td>
                <td>{member.role}</td>
                {
                    userMember.role === "REGULAR" ? null : (
                        <td>
                            {
                                member.role === "OWNER" || member.user_id === userMember.user_id ? "N/A" : (
                                    <>
                                        <button 
                                            className="access-control" 
                                            onClick={() => handleExpel(member.id)}
                                            title={`Remove user, ${member.user.username}, from this organization.`}
                                        >
                                            Expel
                                        </button>
                                        <button
                                            className="access-control"
                                            onClick={() => handleRoleChange(member.id, member.role, oppositeRole)}
                                            title={roleChangteTooltip}
                                        >
                                            {roleChangeText}
                                        </button>
                                    </>
                                )
                            }
                        </td>
                    )
                }
            </tr>
        )
    })

    return (
        <>
            <h1>List of Members</h1>
            <div className="table-container">
                <table id="member-table">
                    <thead>
                        <tr>
                            <th>Row #</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Member Since</th>
                            <th>Role</th>
                            {userMember.role === "REGULAR" ? null : <th>Manage Access</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {memberRows}
                    </tbody>
                </table>
            </div>
        </>
    )
}