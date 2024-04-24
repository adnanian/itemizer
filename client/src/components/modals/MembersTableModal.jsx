import Modal from "../Modal";

export default function MembersTableModal({ members, modal, setModal }) {
    const memberRows = members.map((member, memberIndex) => {
        return (
            <tr>
                <td>{memberIndex + 1}</td>
                <td>{member.user.first_name}</td>
                <td>{member.user.last_name}</td>
                <td>{member.user.username}</td>
                <td>{member.user.email}</td>
                <td>{member.joined}</td>
                <td>{member.role}</td>
            </tr>
        )
    })

    return (
        <Modal openModal={modal} closeModal={() => setModal(false)}>
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
                        </tr>
                    </thead>
                    <tbody>
                        {memberRows}
                    </tbody>
                </table>
            </div>
        </Modal>
    )
}