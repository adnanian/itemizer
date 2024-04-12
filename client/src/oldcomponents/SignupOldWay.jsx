import { useState } from 'react'
import * as yup from "yup"

function SignUpOldWay() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    })

    const clearInputs = () => {
        setFormData((oldFormData) => {
            const clearedFormData = {}
            for (const key in oldFormData) {
                clearedFormData[key] = ""
            }
            return clearedFormData;
        })
    }

    function handleChange(e) {
        const key = e.target.name
        const value = e.target.value
        //console.log(key)
        //console.log(value)
        setFormData({
            ...formData,
            [key]: value
        })
    }

    function handleSubmit(e) {
        e.preventDefault()
        for (const key in formData) {
            if (!formData[key]) {
                console.error("All fields required.")
                alert("All fields required.")
                return;
            }
        }
        if (formData.password !== formData.confirmPassword) {
            console.error("Passwords must match.");
            alert("Passwords must match.");
            return;
        }
        fetch('http://127.0.0.1:5555/api/signup', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                first_name: formData.firstName,
                last_name: formData.lastName,
                username: formData.username,
                email: formData.email,
                password: formData.password
            })
        })
            .then((response) =>
                response.json().then((data) => ({ data, status: response.status }))
            )
            .then(({ data, status }) => {
                console.log('Response status:', status);
                if (status === 201) {
                    console.log('New user successfully created.');
                    alert('New user successfully created.');
                    clearInputs();
                } else {
                    console.error('Unexpected response:', data);
                    alert('Unexpected response. Please check the console for details.');
                }
            })
            .catch((error) => {
                console.error('Network error:', error);
                alert('Network error. Please check the console for details.');
            });
    }

    return (
        <>
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor='firstName'>First Name: </label>
                    <input id='firstName' name='firstName' type='text' value={formData.firstName} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor='lastName'>Last Name: </label>
                    <input id='lastName' name='lastName' type='text' value={formData.lastName} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor='username'>Username: </label>
                    <input id='username' name='username' type='text' value={formData.username} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor='email'>Email Address: </label>
                    <input id='email' name='email' type='text' value={formData.email} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor='password'>Password: </label>
                    <input id='password' name='password' type='password' value={formData.password} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor='confirmPassword'>Confirm Password: </label>
                    <input id='confirmPassword' name='confirmPassword' type='password' value={formData.confirmPassword} onChange={handleChange} />
                </div>
                <input type="submit" />
            </form>
        </>
    )

}

export default SignUpOldWay;