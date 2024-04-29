export default function ConfirmDeleteOrg({ orgId, orgName, onClose }) {

    function handleDeletion(e) {

    }

    const confirmButtonColor = 'yellow'
    const confirmButtonTextColor = 'indigo';

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