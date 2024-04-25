import { useNavigate, useParams } from "react-router-dom";
import StyledTitle from "../components/StyledTitle";
import { useEffect, useState } from "react";
import { hasNothingness } from "../helpers";
import AssignedItemCard from "../components/AssignedItemCard";
import Grid from "../components/Grid";
import MembersTable from "../components/modal-children/MembersTable";
import Modal from "../components/Modal";
import ItemFormContainer from "../components/ItemFormContainer";

export default function Organization() {
    const { orgId, userId } = useParams();
    const [organization, setOrganization] = useState(null);
    const [userMembership, setUserMembership] = useState(null);
    const [modal, setModal] = useState(false);
    const [modalKey, setModaKey] = useState("");
    const [items, setItems] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
        if (!orgId) {
            setOrganization(null);
        } else {
            fetch(`/api/organizations/${orgId}`)
                .then((response) => response.json())
                .then((data) => {
                    setOrganization(data);
                });
        }
    }, [orgId]);

    useEffect(() => {
        if (hasNothingness(orgId, userId, organization)) {
            setUserMembership(null);
        } else {
            //console.log(organization.memberships);
            const userMember = organization.memberships.find((membership) => {
                //const superbool = membership.organization_id == orgId && membership.user_id == userId;
                //console.log(`Type Member O: ${typeof membership.organization_id}, Type O: ${typeof orgId}`);
                //console.log(`Type Member O: ${typeof membership.user_id}, Type O: ${typeof userId}`);
                //console.log(`O: ${membership.organization_id}, U: ${membership.user_id} ==> ${superbool}`);
                //return superbool;
                return membership.organization_id == orgId && membership.user_id == userId;
            });
            //console.log(userMember);
            setUserMembership(userMember);
        }
    }, [orgId, userId, organization]);

    useEffect(() => {
        fetch('/api/items')
            .then((response) => response.json())
            .then((data) => setItems(data))
    }, []);

    const addItem = (item) => {
        setItems([...items, item]);
    }

    //console.log(organization);
    //console.log(userMembership);
    //console.log(!(organization && userMembership))

    if (hasNothingness(organization, userMembership)) {
        return <StyledTitle text="Loading..." />
    }

    function closeModal() {
        setModal(false);
    }

    // CRUD for ASSIGNMENTS


    function addAssignment(assignment, item = null) {
        if (item) {
            addItem(item);
        }
        const newAssignments = [...organization.assignments, assignment];
        setOrganization(oldOrganization => {
            const newOrganization = {...oldOrganization}
            newOrganization["assignments"] = newAssignments;
            return newOrganization;
        });
    }

    function updateAssignment(updatedItemAssignment) {
        const updatedAssignments = organization.assignments.map((assignment) => {
            return assignment.id === updatedItemAssignment.id ? updatedItemAssignment : assignment
        });
        //alert(updatedItemAssignment.count);
        setOrganization((oldOrganization) => {
            const newOrganization = { ...oldOrganization };
            newOrganization["assignments"] = updatedAssignments;
            return newOrganization;
        });
    }

    // CRUD for MEMBERSHIPS

    /**
     * 
     * @param {*} membershipToUpdate 
     */
    function updateMembership(membershipToUpdate) {
        setOrganization((oldOrgData) => {
            const updatedOrg = { ...oldOrgData }
            updatedOrg["memberships"] = oldOrgData.memberships.map((membership) => {
                return membership.id === membershipToUpdate.id ? membershipToUpdate : membership
            });
            return updatedOrg;
        });
    }

    function deleteMembership(membershipToDelete) {
        setOrganization((oldOrgData) => {
            const updatedOrg = { ...oldOrgData }
            updatedOrg["memberships"] = oldOrgData.memberships.filter((membership) => membership.id !== membershipToDelete.id);
            return updatedOrg;
        });
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
        [buttonIds.viewMembers]: <MembersTable members={organization.memberships} userMember={userMembership} onDelete={deleteMembership} onUpdate={updateMembership} />,
        [buttonIds.add]: <ItemFormContainer orgId={organization.id} items={nonAssignedItems()} onAdd={addAssignment} onClose={closeModal} />
    }

    function handleClick(e) {
        switch (e.target.id) {
            case buttonIds.back:
                navigate(-1, { replace: true });
                break;
            case buttonIds.sendUpdate:
                alert(`All members of ${organization.name} have been notified.`);
                break;
            default:
                setModaKey(e.target.id);
                setModal(true);
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
                    <Modal openModal={modal} closeModal={closeModal}>
                        {modalOpeners[modalKey]}
                    </Modal>
                ) :
                    null
            }
        </main>
    );
}