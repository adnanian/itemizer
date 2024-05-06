import { Link } from "react-router-dom";

/**
 * Creates a linkable tile that consists of the basic information
 * about an organization that the current user belongs to as well as
 * the users membership information.
 * 
 * When the link is clicked, the user is navigated to the Organization page,
 * where he/she can access the orgnaization information, such as viewing
 * inventory, and other members.
 * 
 * @param {*} props the user's membership information.
 * @returns A tile of a user's membership informaiton.
 */
export default function JoinedOrgTile(props) {
    return (
        <div className="membership-tile">
            <Link to={`/organizations/${props.orgId}/users/${props.userId}`} >
                <div>
                    <h5>{props.name}</h5>
                    <p>{props.description}</p>
                    <p><b>Created:</b> {props.created}</p>
                    <p><b>Joined:</b> {props.joined}</p>
                    <p><b>Current Role:</b> {props.role}</p>
                </div>
            </Link>
        </div>
    );
}