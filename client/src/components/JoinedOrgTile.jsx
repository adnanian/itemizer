import { Link } from "react-router-dom";

/**
 * TODO
 * 
 * @param {*} props 
 * @returns 
 */
export default function JoinedOrgTile(props) {
    return (
        <div className="membership-tile">
            <Link to={`/organizations/${props.organization_id}`} >
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