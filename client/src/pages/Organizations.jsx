import { useParams } from "react-router-dom";
import StyledTitle from "../components/StyledTitle";

export default function Organizations() {
    const params = useParams();
    console.log(params);

    return <StyledTitle text="Organizations Go Here"/>
}