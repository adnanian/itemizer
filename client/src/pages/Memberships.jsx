import { useParams } from "react-router-dom";
import StyledTitle from "../components/StyledTitle";
import { useEffect, useState } from "react";

export default function Memberships() {
    const params = useParams();
    console.log(params.id);
    const [organizations, setOrganizations] = useState([])

    useEffect(() => {
        usersOrganizations = params.memberships.map((membership) => {
            return null;
        });
    }, [params.id])

    console.log(organizations);

    return (
        <main>
            <button>Create an organization</button>
            <StyledTitle text="List of organizations that a user belongs to go here."/>
        </main>
    )
}