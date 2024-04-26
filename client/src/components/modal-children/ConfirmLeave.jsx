import { useState } from "react"
import { useNavigate } from "react-router-dom";

export default function ConfirmLeave( {userMember, admins, onUpdate, onClose} ) {

    if (userMember.role === "OWNER" && !admins.length) {
        return (
            <div>
                <h1>Unable to Leave Organization</h1>
                <p>
                    You are the current owner of this organization, and there
                    are currently no admins managing it alongside you. In order
                    to leave, you first need to promote at least one member from
                    <em>REGULAR</em> to <em>ADMIN</em>.
                </p>
            </div>
        )
    }

    // Member Id's of admin's.
    const [selectedAdmin, setSelectedAdmin] = useState("");
    // Once you leave, you are navigated to home page.
    const navigate = useNavigate()

    const adminOptions = admins?.map((admin) => {
        return (
            <option key={admin.id} value={admin.id}>
                {admin.user.first_name} {admin.user.last_name} - {admin.user.username}
            </option>
        )
    });

    function handleChange(e) {
        setSelectedAdmin(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        fetch(`/api/memberships/${userMember.id}`, {
            method: "DELETE"
        })
        .then(() => {
            if (selectedAdmin) {
                return fetch(`/api/memberships/${Number.parseInt(selectedAdmin)}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        role: "OWNER"
                    })
                })
                .then((response) => response.json())
                .then((member) => {
                    onUpdate(member);
                });
            }
        })
        .finally(() => {
            onClose();
            navigate(-1, { replace: true } );
        })
    }
    
    return(
        <div>
            <h2>Are you sure you want to leave?</h2>
            <p><strong>Click <q>Submit</q> below to leave the organization.</strong></p>
            {
                userMember.role !== "OWNER" ? null :
                (
                    <>
                        <p>
                            You are the current owner of this organization.
                            In order to leave, you must transfer ownership to
                            an ADMIN. Please select an ADMIN from the drop-down
                            list below.
                        </p>
                        <select onChange={handleChange}>
                            <option key="None" value={""}>Select an ADMIN</option>
                            {adminOptions}
                        </select>
                    </>
                )
            }
            <button
                type="submit" 
                disabled={userMember.role === "OWNER" && !selectedAdmin}
                onClick={handleSubmit}
            >
                Submit
            </button>
        </div>
    )
}