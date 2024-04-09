import { useState } from 'react'

function Signup() {
    const formData = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    })

    function handleChange(e) {
        
    }

    return (
        <>
        <h1>Sign Up</h1>
        <form>
            <div>
                <label htmlFor='firstName'>First Name: </label>
                <input id='firstName' name='firstName' type='text' value={formData.firstName} onChange={handleChange}/>
            </div>
            <div>
                <label htmlFor='lastName'>Last Name: </label>
                <input id='lastName' name='lastName' type='text' value={formData.lastName} onChange={handleChange}/>
            </div>
            <div>
                <label htmlFor='username'>Username: </label>
                <input id='username' name='username' type='text' value={formData.username} onChange={handleChange}/>
            </div>
            <div>
                <label htmlFor='email'>Email Address: </label>
                <input id='email' name='email' type='text' value={formData.email} onChange={handleChange}/>
            </div>
            <div>
                <label htmlFor='password'>Password: </label>
                <input id='password' name='password' type='password' value={formData.password} onChange={handleChange}/>
            </div>
            <div>
                <label htmlFor='confirmPassword'>Confirm Password: </label>
                <input id='confirmPassword' name='confirmPassword' type='password' value={formData.confirmPassword} onChange={handleChange}/>
            </div>
            <input type="submit"/>
        </form>
        </>
    )

}

export default Signup;