import { useNavigate, useParams } from "react-router-dom";
import StyledTitle from "../components/StyledTitle";
import { useEffect, useState } from "react";
import { hasNothingness } from "../helpers";
import AssignedItemCard from "../components/AssignedItemCard";
import Grid from "../components/Grid";
import MembersTableModal from "../components/modals/MembersTableModal";

export default function Organization() {
    const { orgId, userId } = useParams();
    const [organization, setOrganization] = useState(null);
    const [userMembership, setUserMembership] = useState(null);
    const [modal, setModal] = useState(false);
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
            console.log(userMember);
            setUserMembership(userMember);
        }
    }, [orgId, userId, organization]);

    //console.log(organization);
    //console.log(userMembership);
    //console.log(!(organization && userMembership))

    if (hasNothingness(organization, userMembership)) {
        return <StyledTitle text="Loading..." />
    }

    function updateAssignment(updatedItemAssignment) {
        const updatedAssignments = organization.assignments.map((assignment) => {
            return assignment.id === updatedItemAssignment.id ? updatedItemAssignment : assignment
        });
        //alert(updatedItemAssignment.count);
        setOrganization((oldOrganization) => {
            const newOrganization = {...oldOrganization};
            newOrganization["assignments"] = updatedAssignments;
            return newOrganization;
        });
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
        access: "access-button",
        requests: "requests-button",
        edit: "edit-button",
        delete: "delete-button" // for owners to delete the entire organization.
    }

    function confirmLeave(e) {

    }

    function viewMembers(e) {
        if (e.target.id === buttonIds.viewMembers) {
            setModal(true);
        }
    }

    return (
        <main id="inside-org">
            <Grid blockId="org-controls-grid" intermediateId="intermediate">
                <button id={buttonIds.back} className="org-controls" onClick={() => navigate(-1, { replace: true })}>← Back</button>
                <button id={buttonIds.leave} className="org-controls">Leave Org.</button>
                <button id={buttonIds.viewMembers} className="org-controls" onClick={viewMembers}>View List of Members</button>
                <button id={buttonIds.sendUpdate} className="org-controls">Send Update</button>
                <button id={buttonIds.add} className="org-controls">Add Item</button>
                {
                    userMembership.role === "REGULAR" ? null : (
                        <>
                            <button id={buttonIds.remove} className="org-controls">Remove Item</button>
                            <button id={buttonIds.access} className="org-controls">Manage Access</button>
                            <button id={buttonIds.requests} className="org-controls">Request Queue</button>
                        </>
                    )
                }
                {
                    userMembership.role !== "OWNER" ? null : (
                        <>
                            <button id={buttonIds.edit} className="org-controls">Edit Org.</button>
                            <button id={buttonIds.delete} className="org-controls">Delete Org.</button>
                        </>
                    )
                }
            </Grid>
            <StyledTitle text={organization.name}/>
            <h2 id="org-subtitle">{organization.description}</h2>
            <Grid blockId="assigned-items-container" intermediateId={undefined}>
                <ul id="assigned-item-list">
                    {itemCards}
                </ul>
            </Grid>
            <MembersTableModal members={organization.memberships} modal={modal} setModal={setModal}/>
        </main>

    );
}