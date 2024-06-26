import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

/**
 * Renders a login page.
 * 
 * @param {Function} onLogin the callback function to execute when logging in. 
 * @returns the login page.
 */
function Login( {onLogin} ) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    /**
     * Attempts to instantiate a session with the user's id.
     * If credentials are valid, then the user is logged in and is redirected to the Home page.
     * Otherwise, an error message will be displayed saying that the user has entered
     * invalid credentials.
     * 
     * @param {*} e the event.
     */
    function handleSubmit(e) {
        e.preventDefault();
        fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username_or_email: username,
                password: password
            })
        })
            .then((response) => {
                if (response.ok) {
                    return response.json().then((user) => {
                        alert(`Logged In! Welcome, ${user.first_name}!`);
                        onLogin(user);
                        navigate("/");
                    });
                } else {
                    return response.json().then((error) => {
                        console.log(error);
                        throw new Error(error.message);
                    });
                }
            })
            .catch((error) => {
                console.error("Login failed.");
                console.error(error);
                alert("Account with entered credentials does not exist. Please try again!");
            })
            .finally(() => {
                setUsername("");
                setPassword("");
            });
    }

    return (
        <main id="login">
           <div id="login-div" className="main-ui">
           <h1>Log In</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username-or-email">Username or Email</label>
                <input
                    id="username-or-email"
                    name="username-or-email"
                    type="text"
                    placeholder="Enter your username or email."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Log In</button>
            </form>
            <Link
                id="forgot-password"
                className="link-button"
                to="/forgot-password"
            >
                Forgot Password?
            </Link>
            <Link 
                id="signup-instead" 
                className="link-button" 
                to="/signup"
            >
                Don't have an account? Click here to signup!
            </Link>
           </div>
        </main>
    )
}

export default Login;

/**
 * 
 * <Input
                label="Username or Email"
                id="username-or-email"
                name="username-or-email"
                type="text"
                placeholder="Enter your username or email address."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <Input
                label="Password"
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password."
                value={password}
                onChange={(e) => setPassword(e.target.password)}
            />
 * 
 */