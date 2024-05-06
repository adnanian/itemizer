import StyledTitle from "../../components/StyledTitle";
import { hasNothingness, tableRowClassName, DotProgress, useModal } from "../../helpers";
import RequestForm from "../../components/modal-children/requests/RequestForm";
import { useState } from "react";
import Modal from "../../components/Modal";

/**
 * Renders a table of all the organizations and its basic information to the current user.
 * For each row, the information to display are: the name, the owner's username, the number
 * of admins, the total number of members, the organizaiton's description, and one of three
 * elements for the last column.
 * 
 * If you are a member of that organization, the column will render a text saying "You're a member."
 * If you are NOT a member, then the column will render a button for you to click to submit a request to join.
 * If you already requested to join and an admin hasn't processed your request yet, then the
 * column will render a text saying "Membership Request Pending".
 * 
 * @param {Object} param0 
 * @param {Object} param0.user the current user.
 * @param {Array} param0.organizations the organizations array.
 * @param {Function} param0.onAddRequest the callback function to execute when a request has been submitted to join an organization.
 * @returns a table of all the organizations.
 */
export default function OrganizationsTable( {user, organizations, onAddRequest} ) {

    if (hasNothingness(user, organizations)) {
        return <StyledTitle text="Loading organizations..."/>;
    }
    const [orgId, setOrgId] = useState(null);
    const [orgName, setOrgName] = useState(null);
    const [modalActive, toggle] = useModal();
    const requestForOrgIds = user.requests.map((request) => request.organization_id);

    /**
     * When a request button is clicked, the name and id will
     * be passed to their respective state values, and toggle
     * the RequestForm modal open.
     * 
     * @param {*} newOrgId 
     * @param {*} newOrgName 
     */
    function handleRequestClick(newOrgId, newOrgName) {
        //console.log(`${orgId} --- ${orgName}`);
        setOrgId(newOrgId);
        setOrgName(newOrgName);
        toggle();
        //console.log("State updated.");
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