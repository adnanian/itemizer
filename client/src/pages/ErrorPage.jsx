import { useRouteError } from "react-router-dom";
import StyledTitle from "../components/StyledTitle";

export default function ErrorPage() {
    let error = useRouteError();
    console.error(error);
    return <StyledTitle text="An error has occurred. Please navigate back to the home screen and try again." />
}