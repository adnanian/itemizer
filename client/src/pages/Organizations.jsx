import { useParams } from "react-router-dom";
import StyledTitle from "../components/StyledTitle";
import { useEffect, useState } from "react";

export default function Organizations() {
    const [organizations, setOrganizations] = useState([]);
    
    useEffect(() => {
        fetch('/api/organizations')
        .then((response) => response.json())
        .then((data) => setOrganizations(data));
    }, [])

    console.log(organizations);

    return <StyledTitle text="Organizations Go Here"/>
}