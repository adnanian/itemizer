import { useParams } from "react-router-dom";
import StyledTitle from "../components/StyledTitle";
import { useEffect, useState } from "react";

export default function Organizations() {
    const [organizations, setOrganizations] = useState([]);
    
    useEffect(() => {
        fetch('/api/organizations')
    }, [])

    return <StyledTitle text="Organizations Go Here"/>
}