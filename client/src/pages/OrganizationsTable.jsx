import StyledTitle from "../components/StyledTitle";
import { hasNothingness, tableRowClassName, ModalOpener } from "../helpers";
import RequestForm from "../components/modal-children/RequestForm";
import { useState } from "react";
import Modal from "../components/Modal";


/**
 * TODO
 * 
 * 
 */

/**
 * TODO
 * 
 * @param {*} param0 
 * @returns 
 */
export default function OrganizationsTable( {user, organizations, onAddRequest} ) {

    if (hasNothingness(user, organizations)) {
        return <StyledTitle text="Loading organizations..."/>;
    }
    //const [orgId, setOrgId] = useState(null);
    //const [orgName, setOrgName] = useState(null);
    const [modal, setModal] = useState(false);
    const [modalChild, setModalChild] = useState(null);
    const requestForOrgIds = user.requests.map((request) => request.organization_id);

    function closeModal() {
        setModal(false);
    }

    function handleRequestClick(e, orgId, orgName) {
        console.log(`${orgId} --- ${orgName}`);
        if (e.target.id.includes(modalButtonMap.request)) {
            setModalChild(
                <RequestForm userId={user.id} orgId={orgId} orgName={orgName} onAdd={onAddRequest} onClose={closeModal}/>
            )
            setModal(true);
            console.log("State updated.");
        }
    }
    
    const modalButtonMap = {
        create: "create-org",
        request: "request-to-join"
    }

    const orgRows = organizations.map((organization, orgIndex) => {
        const owner = organization.memberships.find((member) => member.role === "OWNER").user.username;
        let adminCount = 0;
        organization.memberships.forEach((membership) => {
            if (membership.role === "ADMIN") {
                adminCount++;
            }
        });
        //const userIsMember = organization.memberships.filter((member) => member.user_id === user.id).length;
        const membershipStatus = () => {
            const userMember = organization.memberships.find((membership) => membership.user_id === user.id);
            if (userMember) {
                return <span className="is-member">You are a member!</span>
            }
            if (requestForOrgIds.includes(organization.id)) {
                return <span className="pending">Membership Request Pending</span>
            }
            return (
                <button 
                    id={`${modalButtonMap.request}-${orgIndex}`}
                    className="join-button"
                    onClick={(e) => handleRequestClick(e, organization.id, organization.name)}
                >
                    Request to join!
                </button>
            );
        };
        //console.log(owner);

        return (
          <tr key={organization.id} className={tableRowClassName(orgIndex + 1)}>
            <td>{orgIndex + 1}</td>
            <td>{organization.name}</td>
            <td>{owner}</td>
            <td>{adminCount}</td>
            <td>{organization.memberships.length}</td>
            <td>{organization.description}</td>
            <td>{membershipStatus()}</td>
          </tr>  
        );
    });

    return (
        <div className="table-container">
            <table id="org-table">
            <thead>
                <tr>
                    <th>Org #</th>{/** ROW # IN TABLE; NOT THE ID  */}
                    <th>Name</th>
                    <th>Owner</th>
                    <th>Admins</th>
                    <th>Members</th>
                    <th>About</th>
                    <th>Are you a member?</th>
                </tr>
            </thead>
            <tbody>
                {orgRows}
            </tbody>
            </table>
            <Modal openModal={modal} closeModal={closeModal}>
                {modalChild}
            </Modal>
        </div>
    );
}