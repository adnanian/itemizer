import { Field, Form, Formik } from "formik";
import * as yup from "yup";
import Input from "./reusables/Input";

/*
* Video Reference: https://www.youtube.com/watch?v=7Ophfq0lEAY&list=PLsBCPpptQcroC7NxdpGNJTIG8x5jv_66G&index=2
*/
const Signup = () => {

    const initialValues = {
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    };

    const formSchema = yup.object().shape({
        firstName: yup.string().required("Must enter first name.").max(30),
        lastName: yup.string().required("Must enter last name.").max(30),
        username: yup.string().required("Must enter user name.").min(8).max(20),
        email: yup.string().email("Please enter a valid email.").required("Must enter email."),
        password: yup.string().min(8).max(32).required("Must create a password."),
        confirmPassword: yup.string().oneOf([yup.ref('password'), null], "Password must match").required("Must enter password again.")
    });

    function handleSubmit(values, actions) {
        fetch("http://127.0.0.1:5555/api/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    first_name: values.firstName,
                    last_name: values.lastName,
                    username: values.username,
                    email: values.email,
                    password: values.password
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
                    } else {
                        console.error('Unexpected response:', data);
                        alert(data.message);
                    }
                })
                .catch((error) => {
                    console.error('Network error:', error);
                    alert(error.message);
                })
                .finally(() => actions.resetForm());
    }

    return (
        <div className="formik">
            <h1>Signup</h1>
            <Formik
                initialValues={initialValues}
                validationSchema={formSchema}
                onSubmit={handleSubmit}
            >
                {(props) => (
                    <Form>
                        <Input
                            label="First Name"
                            id="firstName"
                            name="firstName"
                            type="text"
                            placeholder="Enter your first name."
                        />
                        <Input
                            label="Last Name"
                            id="lastName"
                            name="lastName"
                            type="text"
                            placeholder="Enter your last name."
                        />
                        <Input
                            label="Username"
                            id="username"
                            name="username"
                            type="text"
                            placeholder="Enter your username."
                        />
                        <Input
                            label="Email"
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter your email address."
                        />
                        <Input
                            label="Password"
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Create a password."
                        />
                        <Input
                            label="Confirm Password"
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="Enter your password again."
                        />
                        <button disabled={props.isSubmitting} type="submit">Signup</button>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default Signup;