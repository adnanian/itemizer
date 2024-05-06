import { useEffect, useState } from "react";
import StyledTitle from "../components/StyledTitle";
import { useModal } from "../helpers";
import ConfirmDeleteAccount from "../components/modal-children/profile-settings/ConfirmDeleteAccount";
import Modal from "../components/Modal";
import EditAccount from "../components/modal-children/profile-settings/EditAccount";
import "../styles/Settings.css";
import { useNavigate } from "react-router-dom";

/**
 * Renders a table of the user's non-relational information and options to edit or delete the account.
 * 
 * @param {Object} props 
 * @param {Object} props.user the current user.
 * @param {Function} props.onLogout the callback function to execute when logging out.
 * @returns the user's profile.
 */
export default function ProfileSettings({ user, onLogout }) {
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            console.log("Setting timer");
            const loadingTimeLimit = 2000;
            const timer = setTimeout(() => {
                
                navigate("/unauthorized");
            }, loadingTimeLimit);
            return () => clearTimeout(timer);
        }
    }, [user, navigate]);

    if (!user) {
        return <StyledTitle text="Loading..." />
    }

    const [modalActive, toggle] = useModal();
    const [modalKey, setModalKey] = useState("");

    const buttonIds = {
        edit: "edit-account",
        delete: "delete-account"
    }

    const modals = {
        [buttonIds.edit]: <EditAccount user={user} onLogout={onLogout} onClose={toggle}/>,
        [buttonIds.delete]: <ConfirmDeleteAccount user={user} onLogout={onLogout} onClose={toggle} />
    }

    /**
     * Toggles the modal open and displays the correct view depending on the button clicked.
     * 
     * @param {*} e the event.
     */
    function openModal(e) {
        setModalKey(e.target.id);
        toggle();
    }

    return (
        <main>
            <div id="profile-table" className="table-container">
                <StyledTitle text={"Your Profile"} />
                <table className="borderless-table">
                    <tbody>
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
                        <tr>
                            <th>Last Updated: </th>
                            <td>{user.last_updated || "N/A"}</td>
                        </tr>
                    </tbody>
                </table>
                <button
                    id={buttonIds.edit}
                    onClick={openModal}
                >
                    Edit
                </button>
                <button
                    id={buttonIds.delete}
                    onClick={openModal}
                >
                    Delete
                </button>
            </div>
            {
                modalKey ? (
                    <Modal openModal={modalActive} closeModal={toggle}>
                        {modals[modalKey]}
                    </Modal>
                ) : null
            }
        </main>
    );
}