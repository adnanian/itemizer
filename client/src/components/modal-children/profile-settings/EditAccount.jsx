import { Form, Formik } from "formik";
import * as yup from "yup";
import Input from "../../formik-reusable/Input";
import { useNavigate } from "react-router-dom";

/*
* Video Reference: https://www.youtube.com/watch?v=7Ophfq0lEAY&list=PLsBCPpptQcroC7NxdpGNJTIG8x5jv_66G&index=2
*/

/**
 * Creates a modal form that allows a user to edit his/her profile information, including
 * resetting the password. Note: the user will be required to enter his/her current password
 * to save any changes made.
 * 
 * @param {Object} props 
 * @param {Object} props.user the current user.
 * @param {Function} props.onLogout the callback function execute after a successful update of user info.
 * @param {Function} props.onClose the callback function to execute to close the modal.
 * @returns a modal form for a user to edit his/her information.
 */
export default function EditAccount({ user, onLogout, onClose }) {

    const navigate = useNavigate();

    const initialValues = {
        firstName: user.first_name,
        lastName: user.last_name,
        username: user.username,
        email: user.email,
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    };

    const formSchema = yup.object().shape({
        firstName: yup.string().required("Must enter first name.").max(30),
        lastName: yup.string().required("Must enter last name.").max(30),
        username: yup.string().required("Must enter user name.").min(8).max(20),
        email: yup.string().email("Please enter a valid email.").required("Must enter email."),
        oldPassword: yup.string().min(8).max(32).required("Please enter your password."),
        newPassword: yup.string().min(8).max(32).optional("Change your password or leave blank to keep your current one."),
        confirmNewPassword: yup.string().oneOf([yup.ref('newPassword'), null], "Password must match").optional("Confirm new password, if changing it.")
    });

    /**
     * Updates the user's information on the server and then logs the user out,
     * if the user entered his/her password correctly. Otherwise, displays
     * an error message to the user with all the errors in input.
     * 
     * @param {*} values the values from Formik.
     * @param {*} actions Formik actions.
     */
    function handleSubmit(values, actions) {
        fetch('/api/authenticate', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                password: values.oldPassword
            })
        })
            .then((response) => {
                if (response.status === 204) {
                    fetch(`/api/users/${user.id}`, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            first_name: values.firstName,
                            last_name: values.lastName,
                            username: values.username,
                            email: values.email,
                            new_password: values.newPassword
                        })
                    })
                        .then((response) =>
                            response.json().then((data) => ({ data, status: response.status }))
                        )
                        .then(({ data, status }) => {
                            console.log('Response status:', status);
                            if (status === 200) {
                                navigate("/login");
                                onLogout();
                                alert('Account information updated! You will automatically be logged out. Please log back in using your new credentials.');
                            } else {
                                console.error('Unexpected response:', data);
                                alert(data.message);
                            }
                        })
                } else {
                    throw new Error("Incorrect password! Please try again!");
                }
            })
            .catch((error) => {
                console.error('Network error:', error);
                alert(error.message);
            })
            .finally(() => {
                actions.resetForm();
                onClose();
            });
    }

    return (
        <div id="edit-account-form">
            <h1>Edit Profile</h1>
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
                            id="oldPassword"
                            name="oldPassword"
                            type="password"
                            placeholder="Enter your password."
                        />
                        <Input
                            label="Enter a new password (optional)"
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            placeholder="Enter a new password, or leave blank to keep current."
                        />
                        <Input
                            label="Confirm Password"
                            id="confirmNewPassword"
                            name="confirmNewPassword"
                            type="password"
                            placeholder="Confirm Password"
                            disabled={!props.values.newPassword}
                        />
                        <button disabled={props.isSubmitting || !props.values.oldPassword} type="submit">Update</button>
                    </Form>
                )}
            </Formik>
        </div>
    )
}