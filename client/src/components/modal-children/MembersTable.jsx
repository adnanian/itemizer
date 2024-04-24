import { tableRowClassName } from "../../helpers";

export default function MembersTableModal({ members, userMember }) {

    function handleExpel() {

    }

    function handleRoleChange() {

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
                                            onClick={handleExpel}
                                            title={`Remove user, ${member.user.username}, from this organization.`}
                                        >
                                            Expel
                                        </button>
                                        <button
                                            className="access-control"
                                            onClick={handleRoleChange}
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