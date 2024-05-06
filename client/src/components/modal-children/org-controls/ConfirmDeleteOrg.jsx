import { useNavigate } from "react-router-dom";
import { removeMembershipKey, confirmButtonColor, confirmButtonTextColor } from "../../../helpers";

/**
 * Creates a modal that displays information to an owner, seeking to delete
 * an organization on the consequences of the action that he/she would like
 * to take. If the user would like to proceed, then there is a button to click
 * that would delete an organization.
 * 
 * @param {Object} props 
 * @param {Integer} props.orgId the id of the organization to delete.
 * @param {String} props.orgName the name of the organization to delete.
 * @param {Object} props.userMember the membership to remove when returning to the organization.
 * @param {Function} props.onClose  the callback function to execute when closing the modal.
 * @returns a modal view asking the user to confirm organization deletion.
 */
export default function ConfirmDeleteOrg({ orgId, orgName, userMember, onClose }) {
    const navigate = useNavigate();

    /**
     * Deletes an organization and all its data from the server.
     * Then navigates the user back to the organizations page.
     * The deleted organization would no longer show on that page.
     */
    function handleDeletion() {
        fetch(`/api/organizations/${orgId}`, {
            method: "DELETE"
        })
        .then(() => {
            alert(`${orgName} has been deleted. All members will be notified.`);
        })
        .finally(() => {
            localStorage.setItem(removeMembershipKey, JSON.stringify(userMember));
            navigate(-1);
            onClose();
        })
    }

    return (
        <div >
            <h1>&#9888; Are you sure? &#9888;</h1>
            <p>&#9888; Warning! Deleting an organization will delete all data associated with
                it and <strong>this CANNOT be undone</strong>! By clicking the {confirmButtonColor} button below,
                you agree to these terms and conditions and will not press charges against
                &#0169; Itemizer for such matters.
            </p>
            <button 
                style={{ backgroundColor: confirmButtonColor, color: confirmButtonTextColor }}
                type="submit"
                onClick={handleDeletion}
            >
                Yes, I would like to permanently delete&nbsp;<b>{orgName}</b>!
            </button>
        </div>
    )
}