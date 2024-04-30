import StyledTitle from "../components/StyledTitle";
import { hasNothingness, tableRowClassName, DotProgress, useModal } from "../helpers";
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
    const [orgId, setOrgId] = useState(null);
    const [orgName, setOrgName] = useState(null);
    const [modalActive, toggle] = useModal();
    const requestForOrgIds = user.requests.map((request) => request.organization_id);

    function handleRequestClick(newOrgId, newOrgName) {
        //console.log(`${orgId} --- ${orgName}`);
        setOrgId(newOrgId);
        setOrgName(newOrgName);
        toggle();
        console.log("State updated.");
    }

    //const tableProgress = new DotProgress(organizations.length);

    const orgRows = organizations.map((organization, orgIndex) => {
        //tableProgress.track();
        let owner, adminCount = 0, userMember;
        for (let membership of organization.memberships) {
            switch (membership.role) {
                case "OWNER":
                    owner = membership.user.username;
                    break;
                case "ADMIN":
                    adminCount++;
                    break;
                default:
                    break;
            }
            if (membership.user_id === user.id) {
                userMember = membership;
            }
        }
        const membershipStatus = () => {
            if (userMember) {
                return <span className="is-member">You are a member!</span>
            }
            if (requestForOrgIds.includes(organization.id)) {
                return <span className="pending">Membership Request Pending</span>
            }
            return (
                <button 
                    id={`join-button-${orgIndex}`}
                    className="join-button"
                    onClick={() => handleRequestClick(organization.id, organization.name)}
                >
                    Request to join!
                </button>
            );
        };
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
            <Modal openModal={modalActive} closeModal={toggle}>
                <RequestForm userId={user.id} orgId={orgId} orgName={orgName} onAdd={onAddRequest} onClose={toggle}/>
            </Modal>
        </div>
    );
}