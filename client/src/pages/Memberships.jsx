import { useParams } from "react-router-dom";
import StyledTitle from "../components/StyledTitle";

export default function Memberships() {
    const params = useParams();
    console.log(params);

    return <StyledTitle text="List of organizations that a user belongs to go here."/>
}