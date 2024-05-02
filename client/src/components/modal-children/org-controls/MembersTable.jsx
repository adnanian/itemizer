import { tableRowClassName } from "../../../helpers";


export default function MembersTable({ members, userMember, onDelete, onUpdate }) {

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