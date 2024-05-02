import { useNavigate } from "react-router-dom";
import { removeMembershipKey, confirmButtonColor, confirmButtonTextColor } from "../../../helpers";


export default function ConfirmDeleteOrg({ orgId, orgName, userMember, onClose }) {
    const navigate = useNavigate();

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