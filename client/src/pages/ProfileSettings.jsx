import StyledTitle from "../components/StyledTitle";

export default function ProfileSettings( {user} ) {
    return (
        <div id="profile-table" className="table-container">
            <StyledTitle text={"Your Profile"}/>
            <table className="borderless-table">
                <tr>
                    <th>Name: </th>
                    <td>{user.first_name} {user.last_name}</td>
                </tr>
                <tr>
                    <th>Username: </th>
                    <td>{user.username}</td>
                </tr>
                <tr>
                    <th>Email: </th>
                    <td>{user.email}</td>
                </tr>
                <tr>
                    <th>Created: </th>
                    <td>{user.created}</td>
                </tr>
            </table>
            <button>Edit</button>
        </div>
    );
}