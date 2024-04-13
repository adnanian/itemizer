import { useState } from "react";
import Input from "../components/Input";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState(""); 

    function handleSubmit(e) {
        e.preventDefault();
        
    }

    return (
        <>
        <h1>Log In</h1>
        <form>
            <Input
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
            <button type="submit">Log In</button>
        </form>
        </>
    )
}

export default Login;