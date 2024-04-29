import { useEffect, useState } from "react";
import Memberships from "./Memberships";
import OrganizationsTable from "./OrganizationsTable"
import StyledTitle from "../components/StyledTitle";
import Modal from "../components/Modal";
import OrganizationForm from "../components/modal-children/OrganizationForm";
import { useModal } from "../helpers";



/**
 * TODO
 * 
 * Create an Organization
 * 
 */

/**
 * TODO
 * 
 * @returns 
 */
export default function OrganizationsPage( {user, setUser} ) {
    const [organizations, setOrganizations] = useState([]);
    const [orgFilter, setOrgFilter] = useState(false);
    const [modalActive, toggle] = useModal();

    // Takes on average 1.5 to 2 seconds to run.
    useEffect(() => {
        const timerName = "Execution Time - Fetch";
        //console.time(timerName);
        fetch('/api/organizations')
        .then((response) => response.json())
        .then((data) => {
            setOrganizations(data)
            //console.timeEnd(timerName);
        });
    }, [])

    if (!user) {
        return <StyledTitle text="Loading user..." />
    }

    function addRequest(request) {
        setUser((oldUserData) => {
            const newUserData = {...oldUserData}
            newUserData["requests"] = [...user.requests, request];
            return newUserData;
        });
    }

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