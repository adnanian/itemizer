import { Link, useLocation } from "react-router-dom";
import StyledTitle from "../components/StyledTitle";
import '../styles/ErrorPage.css';

export default function ErrorPage() {
    const location = useLocation();
    console.error("Ree! Invalid route: ", location.pathname);
    return (
        <div id="error-page">
            <StyledTitle text="Ree! Invalid Route!"/>
            <p>
                The page that you have navigated to does
                not exist.<br/>Please click on the link below to
                navigate back to the home page.
            </p>
            <Link to="/" className="link-button">Back to home page!</Link>
        </div>
    )
}