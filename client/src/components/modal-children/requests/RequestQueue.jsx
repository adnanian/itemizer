import { useState } from "react";
import { tableRowClassName } from "../../../helpers";

/**
 * Displays a modal table of the users who have submitted requests to join an organization.
 * Each row contains the user's name, username, email, and the message that they wrote when
 * they submitted the request.
 * 
 * Also included are two buttons in each row: one for accepting , and another for rejecting that user.
 * Clicking each button will switch the view to a confirmation for your decision. If the modal is closed
 * before confirmation, no changes will be made.
 * 
 * If there are no requests made to join the organization, then a message will be displayed to the user
 * instead.
 * 
 * Note: only ADMINs or OWNERS are allowed to see this component.
 * 
 * @param {Object} props 
 * @param {Boolean} props.modalOpen True if this component is currently being displayed to the user; false otherwise.
 * @param {Array} props.requests the requests made to join the organization.
 * @param {String} props.orgName the name of the organization that users have requested to join.
 * @param {Function} props.onWelcome the callback function to execute to accept a user's request.
 * @param {Function} props.onDeny the callback function to execute to reject a user's request.
 * @returns a modal table of all the current active requests to join the organization (if any), or a message indicating otherwise.
 */
export default function RequestQueue({ modalOpen, requests, orgName, onWelcome, onDeny }) {

    if (!requests.length) {
        return <h1>There are currently no requests to join this organization.</h1>
    }

    const acceptButtonText = "Accept", rejectButtonText = "Reject";
    const [response, setResponse] = useState(""); // Text from the table row buttons.
    const [requestToHandle, setRequestToHandle] = useState(null);
    //const acceptButtonKey = "access-control-accept", rejectButtonKey = "access-control-reject";

    /**
     * Clears the response state value so that the view reverts back to the requests table or the "no requests" message.
     * This handy for the event that the current view is the confirmation and the user closes the modal before confirming.
     */
    function resetState() {
        setResponse("");
        setRequestToHandle(null);
    }

    /**
     * Switches the view from the requests table to the confirmation.
     * 
     * @param {*} e the event
     * @param {Object} request the request. 
     */
    function triggerConfirmationModal(e, request) {
        setResponse(e.target.textContent);
        setRequestToHandle(request);
    }

    /**
     * After confirmation, the selected request will be deleted
     * from the server and the table. Then, if the request was accepted,
     * then a new membership will be created for that user who requested
     * for the organization.
     * 
     * @param {*} e the event.
     */
    function handleConfirmation(e) {
        e.preventDefault();
        fetch(`/api/requests/${requestToHandle.id}`, {
            method: "DELETE"
        })
            .then(() => {
                if (response === acceptButtonText) {
                    fetch('/api/memberships', {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            user_id: requestToHandle.user_id,
                            organization_id: requestToHandle.organization_id,
                            role: "REGULAR"
                        })
                    })
                        .then((response) => response.json().then((data) => (
                            { data, status: response.status }
                        )))
                        .then(({ data, status }) => {
                            if (status === 201) {
                                onWelcome(data, requestToHandle)
                                alert(`User ${requestToHandle.user.username} has joined ${orgName}!`);
                            } else {
                                throw new Error(data.message);
                            }
                        })
                        .catch((error) => {
                            console.error(error);
                            alert(error);
                        })
                } else {
                    onDeny(requestToHandle);
                    alert(`User ${requestToHandle.user.username} has been denied entry into ${orgName}!`);
                }
            }).finally(() => {
                resetState();
            });;
    }

    const requestRows = requests.map((request, requestIndex) => {
        return (
            <tr key={request.id} className={tableRowClassName(requestIndex + 1)}>
                <td>{requestIndex + 1}</td>
                <td>{request.user.first_name}</td>
                <td>{request.user.last_name}</td>
                <td>{request.user.username}</td>
                <td>{request.user.email}</td>
                <td>{request.submitted}</td>
                <td>{request.reason_to_join}</td>
                <td>
                    <button
                        id={`access-control-accept-${requestIndex}`}
                        className="access-control"
                        onClick={(e) => triggerConfirmationModal(e, request)}
                    >
                        {acceptButtonText}
                    </button>

                    <button
                        id={`access-control-reject-${requestIndex}`}
                        className="access-control"
                        onClick={(e) => triggerConfirmationModal(e, request)}
                    >
                        {rejectButtonText}
                    </button>
                </td>
            </tr>
        )
    });

    if (!modalOpen && (response || requestToHandle)) {
        resetState();
    }

    return (
        <>
            {
                response ? (
                    <div>
                        <h3>Confirm {response}</h3>
                        <p>Are you sure you would like to {response.toLowerCase()} <strong>{requestToHandle.user.username}</strong>'s request to join <strong>{orgName}</strong>?</p>
                        <span className="confirm">
                            <button type="submit" onClick={handleConfirmation}>Yes</button>
                            <button onClick={resetState}>Cancel</button>
                        </span>
                    </div>
                ) : (
                    <div className="table-container">
                        <table id="request-queue">
                            <thead>
                                <tr>
                                    <th>Request #</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Submission Time</th>
                                    <th>Message</th>
                                    <th>Manage Request</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requestRows}
                            </tbody>
                        </table>
                    </div>
                )
            }
        </>
    );
}