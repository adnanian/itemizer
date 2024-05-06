import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { removeMembershipKey } from "../../../helpers";

/**
 * Displays a modal view prompting a user to confirm his/her decision
 * to leave an organization. If the user leaving is the owner, then
 * he/she will be prompted to transfer ownership to an admin. If
 * there are no admins in the organization, then the owner could not
 * leave until another member is promoted from REGULAR to admin.
 * 
 * @param {Object} props 
 * @param {Object} param0.userMember the user requesting to leave.
 * @param {Array} param0.admins the admins of the organization to leave.
 * @param {Function} param0.onUpdate the callback function to execute when the user has left.
 * @param {Function} param0.onClose the callback function to execute to close the modal.
 * @returns the modal view prompting the user to confirm the decision to leave the organization.
 */
export default function ConfirmLeave({ userMember, admins, onUpdate, onClose }) {

    if (userMember.role === "OWNER" && !admins.length) {
        return (
            <div>
                <h1>Unable to Leave Organization</h1>
                <p>
                    You are the current owner of this organization, and there
                    are currently no admins managing it alongside you. In order
                    to leave, you first need to promote at least one member from
                    &nbsp;<em>REGULAR</em> to <em>ADMIN</em>.
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

    /**
     * Sets the selectedAdmin's state value to the value of the selected opetion.
     * 
     * @param {*} e the event.
     */
    function handleChange(e) {
        setSelectedAdmin(e.target.value);
    }

    /**
     * Deletes the user's membership from the organization from the server side.
     * Then, if the deleted membership was the owner, sets the new owner to the
     * admin that the owner selected, retrieved from selectedAdmin.
     * Finally, closes the modal.
     */
    function handleSubmit() {
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
                //console.log(userMember);
                localStorage.setItem(removeMembershipKey, JSON.stringify(userMember));
                navigate(-1);
                onClose();
            })
    }

    return (
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