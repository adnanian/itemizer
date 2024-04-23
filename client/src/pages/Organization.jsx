import { useNavigate, useParams } from "react-router-dom";
import StyledTitle from "../components/StyledTitle";
import { useEffect, useState } from "react";
import { hasNothingness } from "../helpers";
import AssignedItemCard from "../components/AssignedItemCard";
import Grid from "../components/Grid";

export default function Organization() {
    const { orgId, userId } = useParams();
    const [organization, setOrganization] = useState(null);
    const [userMembership, setUserMembership] = useState(null);
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

    function updateItem(updatedItem) {

    }

    const itemCards = organization.assignments.map((assignment) => {
        return (
            <li key={assignment.id}>
                <AssignedItemCard
                    item={assignment.item}
                    addedAt={assignment.added_at}
                    lastUpdated={assignment.last_updated}
                    quantity={assignment.count}
                    onUpdate={updateItem}
                />
            </li>
        )
    });

    return (
        <main id="inside-org">
            <Grid blockId="org-controls-grid" intermediateId="intermediate">
                <button id="back-button" className="org-controls" onClick={() => navigate(-1, { replace: true })}>← Back</button>
                <button id="leave-button" className="org-controls">Leave Org.</button>
                <button className="org-controls">View List of Members</button>
                <button className="org-controls">Send Update</button>
                <button className="org-controls">Add Item</button>
                {
                    userMembership.role === "REGULAR" ? null : (
                        <>
                            <button className="org-controls">Remove Item</button>
                            <button className="org-controls">Manage Access</button>
                            <button className="org-controls">Request Queue</button>
                        </>
                    )
                }
                {
                    userMembership.role !== "OWNER" ? null : (
                        <>
                            <button className="org-controls">Edit Org.</button>
                            <button className="org-controls">Delete Org.</button>
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
        </main>

    );
}