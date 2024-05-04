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

export default function Organization() {
    const { orgId, userId } = useParams();
    const [organization, setOrganization] = useState(null);
    const [userMembership, setUserMembership] = useState(null);
    const [orgUpdated, setOrgUpdated] = useState(false);
    const [items, setItems] = useState([]);
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

    /*
    useEffect(() => {
        let promise = null;
        if (!orgId) {
            setOrganization(null);
        } else {
            promise = await fetch(`/api/organizations/${orgId}`)
                .then((response) => {
                    if (!response.ok) {
                        navigate("/unauthorized");
                    }
                    return response.json();
                })
                .then((data) => {
                    //console.log(data);
                    setOrganization(data);
                    return data;
                });
        }
        if (hasNothingness(userId, promise)) {
            setUserMembership(null);
        } else {
            console.log(promise);
            console.log(promise.data);
        }
    }, [orgId]);
    */

    /*
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
    */

    useEffect(() => {
        fetch('/api/items')
            .then((response) => response.json())
            .then((data) => setItems(data))
    }, []);

    const addItem = (item) => {
        setItems([...items, item]);
    }

    console.log(organization);
    console.log(userMembership);
    //console.log(!(organization && userMembership))

    
    if (hasNothingness(organization, userMembership)) {
        return <StyledTitle text="Loading..." />
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

    function deleteAssignment(assignmentToDelete) {
        setOrganization((oldOrgData) => {
            const newOrgData = {...oldOrgData};
            newOrgData["assignments"] = organization.assignments.filter((assignment) => {
                return assignment.id !== assignmentToDelete.id;
            });
            return newOrgData;
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
        setOrganization((oldOrgData) => {
            const updatedOrg = { ...oldOrgData }
            updatedOrg["memberships"] = [...oldOrgData.memberships, membership];
            updatedOrg["requests"] = oldOrgData.requests.filter((request) => request.id !== acceptedRequest.id);
            return updatedOrg;
        });
    }

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

    function denyMembership(deniedRequest) {
        setOrganization((oldOrgData) => {
            const updatedOrg = { ...oldOrgData }
            updatedOrg["requests"] = oldOrgData.requests.filter((request) => request.id !== deniedRequest.id);
            return updatedOrg;
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