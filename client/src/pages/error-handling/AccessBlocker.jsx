import StyledTitle from "../../components/StyledTitle";
import '../../styles/Error.css';

export default function AccessBlocker() {
    return (
        <div className="error-page">
            <StyledTitle text="401 Permission Denied"/>
            <p>
                You must be logged in in order to access this page.
            </p>
        </div>
    )
}