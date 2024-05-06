import { useEffect, useState } from "react";
import Memberships from "./Memberships";
import OrganizationsTable from "./OrganizationsTable"
import StyledTitle from "../../components/StyledTitle";
import Modal from "../../components/Modal";
import OrganizationForm from "../../components/modal-children/org-controls/OrganizationForm";
import { removeMembershipKey, updateMembershipKey, updateKeyObjSize, useModal } from "../../helpers";
import { useNavigate } from "react-router-dom";

/**
 * Displays basic information for all organizations and user's memberships that exist in the system.
 * This page is divided into two views which are accessed through radio button selection.
 * The left view is the OrganizationsTable, which shows all the organizations in the system.
 * The right view is the Memberships, which shows all the organization that the current user belongs to.
 * 
 * @param {Object} props 
 * @param {*} props.user the current user.
 * @param {*} props.setUser the callback function to execute to update the user's information.
 * @returns A page of radio buttons to navigate between OrganizationsTable and Memberships.
 */
export default function OrganizationsPage( {user, setUser} ) {
    const [organizations, setOrganizations] = useState([]);
    const [orgFilter, setOrgFilter] = useState(false);
    const [modalActive, toggle] = useModal();
    const navigate = useNavigate();

    // Takes on average 1.5 to 2 seconds to run.
    useEffect(() => {
        const timerName = "Execution Time - Fetch";
        //console.time(timerName);
        const passedValue =  JSON.parse(localStorage.getItem(updateMembershipKey)) || JSON.parse(localStorage.getItem(removeMembershipKey));
        //console.log(passedValue);
        if (typeof passedValue === 'object' && passedValue !== null) {
            setUser((oldUserData) => {
                const newUserData = {...oldUserData};
                if (Object.keys(passedValue).length === updateKeyObjSize) {
                    newUserData.memberships = oldUserData.memberships.map((membership) => {
                        if (membership.id === passedValue.membership.id) {
                            membership.organization = {};
                            for (const key in passedValue.organization) {
                                if (!Array.isArray(key)) {
                                    membership.organization[key] = passedValue.organization[key];
                                }
                            }
                        }
                        return membership;
                    });
                    localStorage.removeItem(updateMembershipKey);
                    console.log("Membership updated");
                } else {
                    newUserData.memberships = oldUserData.memberships.filter((membership) => membership.id !== passedValue.id);
                    localStorage.removeItem(removeMembershipKey);
                    console.log("Membership removed");
                }
                return newUserData;
            });
            
            
        }
        fetch('/api/organizations')
        .then((response) => {
            if (!response.ok) {
                navigate("/unauthorized");
            }
            return response.json();
        })
        .then((data) => {
            setOrganizations(data);

            //console.timeEnd(timerName);
        });
        //console.log(passedValue);
    }, []);

    if (!user) {
        return <StyledTitle text="Loading user..." />
    }

    /**
     * Adds a new request to a user's requests array.
     * 
     * @param {Object} request the request to add.
     */
    function addRequest(request) {
        setUser((oldUserData) => {
            const newUserData = {...oldUserData}
            newUserData["requests"] = [...user.requests, request];
            return newUserData;
        });
    }

    /**
     * Adds a new organization to the organizations array.
     * Then adds a membership to the user's membership array,
     * where the user is the owner of that newly created organization.
     * 
     * @param {Object} org the organization to add.
     * @param {Object} membership the membership to add.
     */
    function addOrganization(org, membership) {
        org.memberships = [membership];
        setOrganizations([...organizations, org]);
        setUser((oldUserData) => {
            const newUserData = {...oldUserData}
            newUserData.memberships = [...oldUserData.memberships, membership];
            return newUserData;
        })
    }

    //console.log(user);
    //console.log(modalActive);

    return (
        <main>
            <div id="org-radio" className="radio-group">
                <input
                    id="table"
                    name="table"
                    type="radio"
                    value="All Organizations"
                    onChange={(e) => setOrgFilter(false)}
                    checked={!orgFilter}
                />
                <span>All Organizations</span>
                <input
                    id="filter-grid"
                    name="filter-grid"
                    type="radio"
                    value="My Organizations"
                    onChange={(e) => setOrgFilter(true)}
                    checked={orgFilter}
                />
                <span>My Organizations</span>
            </div>
            <button id="org-create" onClick={toggle}>Create an organization</button>
            {
                orgFilter 
                ? <Memberships memberships={user.memberships}/>
                : <OrganizationsTable user={user} organizations={organizations} onAddRequest={addRequest}/>
            }
            <Modal openModal={modalActive} closeModal={toggle}>
                <OrganizationForm userId={user.id} onAdd={addOrganization} onclose={toggle}/>
            </Modal>
        </main>
    );
}