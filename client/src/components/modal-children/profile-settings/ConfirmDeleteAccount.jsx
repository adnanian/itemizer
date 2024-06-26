import { useState } from "react";
import { confirmButtonColor, confirmButtonTextColor } from "../../../helpers";
import { useNavigate } from "react-router-dom";

/**
 * Creates a modal view that displays to the user a message about the consequences
 * of deleting his/her account, and a button to proceed with account deletion.
 * 
 * @param {Object} props 
 * @param {Object} props.user the current user.
 * @param {Function} props.onLogout the callback function to execute after the account has been successfully deleted.
 * @param {Function} props.onClose the callback function to execute to close the modal.
 * @returns a modal view with a confirmation message and a button to confirm deletion.
 */
export default function ConfirmDeleteAccount({ user, onLogout, onClose }) {

    const ownerships = user.memberships.reduce((accumulator, membership) => {
        return accumulator + (membership.role === "OWNER" ? 1 : 0);
    }, 0);
    console.log(`${user.username} owns ${ownerships} org(s).`);

    if (ownerships > 0) {
        console.log(ownerships);
        const orgGrammaticalForm = ownerships === 1 ? "organization" : "organizations";
        const pronoun = ownerships === 1 ? "it" : "them";
        const adminGrammaticalForm = ownerships === 1 ? "another admin" : "other admins";
        return(
            <div>
                <p style={{fontSize: "28px"}}>
                    You currently own {ownerships} {orgGrammaticalForm}. Please delete&nbsp;
                    {pronoun} or transfer {pronoun} to {adminGrammaticalForm}. You won't be
                    able to delete your account until all organizations you own have been
                    either deleted or transferred to other users.
                </p>
            </div>
        );
    }

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    /**
     * Deletes a user and all its information from the server.
     * Then, reroutes current user to login information.
     * 
     * Note: deletion will fail if user enters incorrect password.
     * 
     * @param {*} e the event.
     */
    function handleDeletion(e) {
        e.preventDefault();
        fetch('/api/authenticate', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                password: password
            })
        })
            .then((response) => {
                console.log(response);
                if (response.status === 204) {
                    fetch(`/api/users/${user.id}`, {
                        method: "DELETE"
                    })
                        .then(() => {
                            navigate("/login");
                            onLogout();
                            alert("Your account has been deleted! You will now be returned to the login screen!");
                        });
                } else {
                    throw new Error("Incorrect password! Please try again!");
                }
            })
            .catch((error) => alert(error))
            .finally(() => {
                setPassword("");
                setConfirmPassword("");
                onClose();
            });
    }

    return (
        <div id="delete-account">
            <form>
                <h1>&#9888; Are you sure? &#9888;</h1>
                <p>&#9888; Warning! Deleting your account will delete all data associated with
                    it and <strong>this CANNOT be undone</strong>! By clicking the {confirmButtonColor} button below,
                    you agree to these terms and conditions and will not press charges against
                    &#0169; Itemizer for such matters.
                </p>
                <label htmlFor="password">Enter your password: </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <label htmlFor="confirmPassword">Confirm password: </label>
                <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                    style={{ backgroundColor: confirmButtonColor, color: confirmButtonTextColor }}
                    type="submit"
                    onClick={handleDeletion}
                    disabled={!password.length || password !== confirmPassword}
                    title="This button will only be enabled when you enter matching password."
                >
                    Yes, I would like to permanently delete&nbsp;my account!
                </button>
            </form>
        </div>
    )
}