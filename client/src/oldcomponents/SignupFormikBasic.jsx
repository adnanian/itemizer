import { useFormik } from "formik";
import * as yup from "yup";
import InputErrorMessage from "../components/InputErrorMessage";

function SignupFormikBasic() {
    const formSchema = yup.object().shape({
        firstName: yup.string().required("Must enter first name.").max(30),
        lastName: yup.string().required("Must enter last name.").max(30),
        username: yup.string().required("Must enter user name.").min(8).max(20),
        email: yup.string().email("Please enter a valid email.").required("Must enter email."),
        password: yup.string().min(8).max(32).required("Must create a password."),
        confirmPassword: yup.string().oneOf([yup.ref('password'), null], "Password must match").required("Must enter password again.")
    });

    const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting } = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            username: "",
            email: "",
            password: "",
            confirmPassword: ""
        },
        validationSchema: formSchema,
        onSubmit: async (values, actions) => {
            console.log(values);
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
                        actions.resetForm();
                    } else {
                        console.error('Unexpected response:', data);
                        alert(data.message);
                    }
                })
                .catch((error) => {
                    console.error('Network error:', error);
                    alert(error.message);
                });
        }
    });

    return (
        <>
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="firstName">First Name</label>
                <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="Enter your first name."
                    value={values.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.firstName && touched.firstName ? "input-error" : ""}
                />
                <InputErrorMessage errors={errors.firstName} touched={touched.firstName} />
                <label htmlFor="lastName">Last Name</label>
                <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Enter your last name."
                    value={values.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.lastName && touched.lastName ? "input-error" : ""}
                />
                <InputErrorMessage errors={errors.lastName} touched={touched.lastName} />
                <label htmlFor="Username">userame</label>
                <input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Enter your username."
                    value={values.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.username && touched.username ? "input-error" : ""}
                />
                <InputErrorMessage errors={errors.username} touched={touched.username} />
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email address."
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.email && touched.email ? "input-error" : ""}
                />
                <InputErrorMessage errors={errors.email} touched={touched.email} />
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Create a password."
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.password && touched.password ? "input-error" : ""}
                />
                <InputErrorMessage errors={errors.password} touched={touched.password} />
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Enter your password again."
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.confirmPassword && touched.confirmPassword ? "input-error" : ""}
                />
                <InputErrorMessage errors={errors.confirmPassword} touched={touched.confirmPassword} />
                <button disabled={isSubmitting} type="submit">Signup</button>
            </form>
        </>
    );
}

export default SignupFormikBasic;