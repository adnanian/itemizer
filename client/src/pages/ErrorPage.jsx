import { Link, useLocation } from "react-router-dom";

function ErrorPage() {
    const location = useLocation();

    return (
        <main>
            <h1>Unknown error occurred!</h1>
            <p>Invalid URL: {location.pathname}</p>
            <Link to="/">Go Home</Link>
        </main>
    );
}

export default ErrorPage;