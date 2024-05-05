import { useNavigate, useParams } from "react-router-dom";
import StyledTitle from "../../components/StyledTitle";
import { useEffect, useState } from "react";
import { hasNothingness, updateMembershipKey, useModal } from "../../helpers";
import AssignedItemCard from "../../components/AssignedItemCard";
import Grid from "../../components/Grid";
import MembersTable from "../../components/modal-children/org-controls/MembersTable";
import Modal from "../../components/Modal";
import ItemFormContainer from "../../components/modal-children/item-assignments/ItemFormContainer";
import ConfirmLeave from "../../components/modal-children/org-controls/ConfirmLeave";
import ConfirmRemoveItem from "../../components/modal-children/item-assignments/ConfirmRemoveItem";
import RequestQueue from "../../components/modal-children/requests/RequestQueue";
import ConfirmDeleteOrg from "../../components/modal-children/org-controls/ConfirmDeleteOrg";
import EditOrganizationForm from "../../components/modal-children/org-controls/EditOrganizationForm";
import "../../styles/Organization.css";

/**
 * 
 * 
 */

export default function Organization({ items, onAddItem }) {
    const { orgId, userId } = useParams();
    const [organization, setOrganization] = useState(null);
    const [userMembership, setUserMembership] = useState(null);
    const [orgUpdated, setOrgUpdated] = useState(false);
    const [modalKey, setModalKey] = useState("");
    const [modalActive, toggle] = useModal();

    const navigate = useNavigate();

    useEffect(() => {
        async function fetchOrg() {
            const promise = await fetch(`/api/organizations/${orgId}`)
                .then((response) => {
                    //console.log(response.ok);
                    if (!response.ok) {
                        navigate("/unauthorized");
                    }
                    return response.json();
                })
                .then((data) => {
                    setOrganization(data);
                    return data;
                });
            const userMember = promise.memberships.find((membership) => {
                return membership.organization_id == orgId && membership.user_id == userId;
            });
            if (!userMember) {
                // A user who attempts to access an organization without being a member of it, will be redirected to the error page.
                navigate("/error");
            }
            setUserMembership(userMember);
        }

        if (hasNothingness(orgId, userId)) {
            setOrganization(null);
            userMembership(null);
        } else {
            //console.log(orgId);
            fetchOrg();
        }
        //console.log("Use Effect Run");
    }, [orgId, userId]);

    //console.log(organization);
    //console.log(userMembership);
    //console.log(!(organization && userMembership))


    if (hasNothingness(organization, userMembership)) {
        return <StyledTitle text="Loading..." />
    }

    // CRUD for ASSIGNMENTS

    function addAssignment(assignment, item = null) {
        if (item) {
            onAddItem(item);
        }
        setOrganization({
            ...organization,
            assignments: [...organization.assignments, assignment]
        });
    }

    function updateAssignment(updatedItemAssignment) {
        setOrganization({
            ...organization,
            assignments: organization.assignments.map((assignment) => {
                return assignment.id !== updatedItemAssignment.id ? assignment : updatedItemAssignment;
            })
        });
    }

    function deleteAssignment(assignmentToDelete) {
        setOrganization({
            ...organization,
            assignments: organization.assignments.filter((assignment) => {
                return assignment.id !== assignmentToDelete.id;
            })
        });
    }

    // CRUD for MEMBERSHIPS

    /**
     * Adds a new membership object to the organization, and removes a request object from it.
     * This is a request being accepted, and a new user joining the organization.
     * 
     * @param {*} membership the membership to add.
     * @param {*} acceptedRequest the request to remove.
     */
    function welcomeNewMember(membership, acceptedRequest) {
        setOrganization({
            ...organization,
            memberships: [...organization.memberships, membership],
            requests: organization.requests.filter((request) => request.id !== acceptedRequest.id)
        });
    }

    /**
     * 
     * @param {*} membershipToUpdate 
     */
    function updateMembership(membershipToUpdate) {
        setOrganization({
            ...organization,
            memberships: organization.memberships.map((membership) => {
                return membership.id !== membershipToUpdate.id ? membership : membershipToUpdate;
            })
        });
    }

    function deleteMembership(membershipToDelete) {
        setOrganization({
            ...organization,
            memberships: organization.memberships.filter((membership) => membership.id !== membershipToDelete.id)
        });
    }

    function denyMembership(deniedRequest) {
        setOrganization({
            ...organization,
            requests: organization.requests.filter((request) => request.id !== deniedRequest.id)
        });
    }

    // CRUD FOR UPDATING ORGANIZATION
    function updateOrganization(updatedOrg) {
        setOrganization(updatedOrg);
        setOrgUpdated(true);
    }

    const nonAssignedItems = () => {
        const assignedItemIds = organization.assignments.map(assignment => assignment.item.id);
        //console.log(assignedItemIds);
        const nonAssignedItemsArray = items.filter(item => !assignedItemIds.includes(item.id));
        return nonAssignedItemsArray;
    }

    const itemCards = organization.assignments.map((assignment) => {
        return (
            <li key={assignment.id}>
                <AssignedItemCard
                    item={assignment.item}
                    addedAt={assignment.added_at}
                    lastUpdated={assignment.last_updated}
                    quantity={assignment.count}
                    assignmentId={assignment.id}
                    onUpdate={updateAssignment}
                />
            </li>
        )
    });

    const admins = userMembership.role !== "OWNER" ? null : organization.memberships.filter((membership) => membership.role === "ADMIN");

    const buttonIds = {
        back: "back-button",
        leave: "leave-button",
        viewMembers: "member-list-button",
        sendUpdate: "update-button",
        add: "add-button",
        remove: "remove-button", // for admins to remove managed items from the organization.
        requests: "requests-button",
        edit: "edit-button",
        delete: "delete-button" // for owners to delete the entire organization.
    }

    const modalOpeners = {
        [buttonIds.leave]: (
            <ConfirmLeave
                userMember={userMembership}
                admins={admins}
                onUpdate={updateMembership}
                onClose={toggle}
            />
        ),
        [buttonIds.viewMembers]: (
            <MembersTable
                members={organization.memberships}
                userMember={userMembership}
                onDelete={deleteMembership}
                onUpdate={updateMembership}
            />
        ),
        [buttonIds.add]: (
            <ItemFormContainer
                orgId={organization.id}
                items={nonAssignedItems()}
                onAdd={addAssignment}
                onClose={toggle}
            />
        ),
        [buttonIds.remove]: (
            <ConfirmRemoveItem
                assignments={organization.assignments}
                onDelete={deleteAssignment}
                onClose={toggle}
            />
        ),
        [buttonIds.requests]: (
            <RequestQueue
                modalOpen={modalActive}
                requests={organization.requests}
                orgName={organization.name}
                onWelcome={welcomeNewMember}
                onDeny={denyMembership}
            />
        ),
        [buttonIds.edit]: (
            <EditOrganizationForm
                orgId={organization.id}
                orgName={organization.name}
                orgDescription={organization.description}
                onUpdate={updateOrganization}
                onClose={toggle}
            />
        ),
        [buttonIds.delete]: (
            <ConfirmDeleteOrg
                orgId={organization.id}
                orgName={organization.name}
                userMember={userMembership}
                onClose={toggle}
            />
        )
    }

    function handleClick(e) {
        switch (e.target.id) {
            case buttonIds.back:
                if (orgUpdated) {
                    const objectToPass = {
                        membership: userMembership,
                        organization: organization
                    }
                    localStorage.setItem(updateMembershipKey, JSON.stringify(objectToPass));
                }
                navigate(-1);
                break;
            case buttonIds.sendUpdate:
                alert(`All members of ${organization.name} have been notified.`);
                break;
            default:
                setModalKey(e.target.id);
                toggle();
                break;
        }
    }

    return (
        <main id="inside-org">
            <Grid blockId="org-controls-grid" intermediateId="intermediate">
                <button
                    id={buttonIds.back}
                    className="org-controls"
                    onClick={handleClick}
                >
                    ← Back
                </button>
                <button
                    id={buttonIds.leave}
                    className="org-controls"
                    onClick={handleClick}
                >
                    Leave Org.
                </button>
                <button
                    id={buttonIds.viewMembers}
                    className="org-controls"
                    onClick={handleClick}
                >
                    View List of Members
                </button>
                <button
                    id={buttonIds.sendUpdate}
                    className="org-controls"
                    onClick={handleClick}
                >
                    Send Update
                </button>
                <button
                    id={buttonIds.add}
                    onClick={handleClick}
                >
                    Add Item
                </button>
                {
                    userMembership.role === "REGULAR" ? null : (
                        <>
                            <button
                                id={buttonIds.remove}
                                className="org-controls"
                                onClick={handleClick}
                                disabled={!itemCards.length}
                            >
                                Remove Item
                            </button>
                            <button
                                id={buttonIds.requests}
                                className="org-controls"
                                onClick={handleClick}
                            >
                                Request Queue
                            </button>
                        </>
                    )
                }
                {
                    userMembership.role !== "OWNER" ? null : (
                        <>
                            <button
                                id={buttonIds.edit}
                                className="org-controls"
                                onClick={handleClick}
                            >
                                Edit Org.
                            </button>
                            <button
                                id={buttonIds.delete}
                                className="org-controls"
                                onClick={handleClick}
                            >
                                Delete Org.
                            </button>
                        </>
                    )
                }
            </Grid>
            <StyledTitle text={organization.name} />
            <h2 id="org-subtitle">{organization.description}</h2>
            <Grid blockId="assigned-items-container" intermediateId={undefined}>
                <ul id="assigned-item-list">
                    {itemCards}
                </ul>
            </Grid>
            {
                modalKey ? (
                    <Modal openModal={modalActive} closeModal={toggle}>
                        {modalOpeners[modalKey]}
                    </Modal>
                ) :
                    null
            }
        </main>
    );
    
}