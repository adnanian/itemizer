import { useState } from "react";
import StyledTitle from "../components/StyledTitle";
import { useModal } from "../helpers";
import ConfirmDeleteAccount from "../components/modal-children/profile-settings/ConfirmDeleteAccount";
import Modal from "../components/Modal";
import EditAccount from "../components/modal-children/profile-settings/EditAccount";

export default function ProfileSettings({ user, onLogout }) {

    if (!user) {
        return <StyledTitle text="loading" />
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