import { Form, Formik } from "formik";
import * as yup from "yup";
import Input from "../../formik-reusable/Input";
import TextArea from "../../formik-reusable/TextArea";

/**
 * Creates a form that allows user to create a new organiztaion
 * by entering a name and description.
 * 
 * @param {Object} props 
 * @param {Integer} props.userId the current user's id.
 * @param {Function} props.onAdd the callback function to execute upon creating the organization and membership on the server side.
 * @param {Function} props.onclose the callback function to execute to close the modal.
 * @returns a modal form prompting users to create a new organization.
 */
export default function OrganizationForm( {userId, onAdd, onclose} ) {
    const initialValues = {
        name: "",
        description: ""
    }

    const formSchema = yup.object().shape({
        name: yup.string().required("Name required."),
        description: yup.string().min(50).required("Describe your organization with at least 50 characters.")
    });

    /**
     * Attempts to create a new organization on the server side.
     * Then if successful, creates a new membership with the current
     * user as the owner. Finally, displays the new organization
     * on the OrganizationsPage.
     * 
     * If creation fails on the server side, than an error message
     * will be displayed to the user.
     * 
     * @param {*} values the values from Formik.
     * @param {*} actions Formik actions.
     * @returns false so that the web app does not refresh.
     */
    function handleSubmit(values, actions) {
        fetch("/api/organizations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: values.name,
                description: values.description
            })
        })
        .then((response) => response.json().then((orgData) => (
            {orgData, status: response.status}
        )))
        .then(({ orgData, status }) => {
            if (status === 201) {
                fetch('/api/memberships', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        user_id: userId,
                        organization_id: orgData.id,
                        role: "OWNER"
                    })
                })
                .then((response) => response.json().then((memberData) => (
                    {memberData, nextStatus: response.status}
                )))
                .then( ({memberData, nextStatus}) => {
                    if (nextStatus === 201) {
                        console.log(`Calling at OrgForm: ${memberData}`);
                        onAdd(orgData, memberData);
                        alert("Organization creation successful!");
                    } else {
                        throw new Error(`Membership Creation failed: ${memberData.message}`);
                    }
                })
                .catch((error) => {
                    console.error(error);
                    alert(error);
                    fetch(`/organizations/${orgData.id}`, {
                        method: "DELETE"
                    })
                    .then(() => console.log(`${orgData.name} creation failed!`));
                })
            } else {
                throw new Error(`Organization Creation failed: name must be unique.`);
            }
        })
        .catch((error) => {
            console.error(error);
            alert(error);
        })
        .finally(() => {
            actions.resetForm();
            onclose();
            return false;
        });
    }
    
    return (
        <div>
            <h1>Create a new organization!</h1>
            <Formik
                initialValues={initialValues}
                validationSchema={formSchema}
                onSubmit={handleSubmit}
            >
                {(props) => {
                    return (
                        <Form>
                            <Input
                                label="Name: "
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Enter the name."
                            />
                            <TextArea
                                label="Description: "
                                id="description"
                                name="description"
                                rows="5"
                                cols="50"
                                placeholder="Add description here. (Min: 50 characters)"
                            />
                            <span>{`${props.values.description.length} characters`}</span>
                            <button disabled={props.isSubmitting} type="submit">Submit</button>
                        </Form>
                    )
                }}
            </Formik>
        </div>
    )
}