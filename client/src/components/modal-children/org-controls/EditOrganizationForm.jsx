import { Form, Formik } from "formik";
import * as yup from "yup";
import Input from "../../formik-reusable/Input";
import TextArea from "../../formik-reusable/TextArea";

/**
 * Displays a form allowing the owner to edit the basic information of
 * an organization (i.e. the name and description).
 * 
 * @param {Object} props 
 * @param {Integer} props.orgId the id of the organization to update.
 * @param {String} props.orgName the current name of the organization.
 * @param {String} props.orgDescription the current description of the organization.
 * @param {Function} props.onUpdate the callback function to execute after updating the organization's info on the server.
 * @param {Function} props.onClose the callback function to execute to close the modal.
 * @returns a modal form allowing the owner to edit the organization's info.
 */
export default function EditOrganizationForm( {orgId, orgName, orgDescription, onUpdate, onClose} ) {
    const initialValues = {
        name: orgName,
        description: orgDescription
    }

    const formSchema = yup.object().shape({
        name: yup.string().required("Name required."),
        description: yup.string().min(50).required("Describe your organization with at least 50 characters.")
    });

    /**
     * Updates the organization's data.
     * 
     * @param {*} values the values from Formik.
     * @param {*} actions Formik actions.
     * @returns false so that the web app does not refresh.
     */
    function handleSubmit(values, actions) {
        fetch(`/api/organizations/${orgId}`, {
            method: "PATCH",
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
            if (status === 200) {
                onUpdate(orgData);
                alert("Organization update successful!");
            } else {
                throw new Error(`Organization Update failed: ${orgData.message}`);
            }
        })
        .catch((error) => {
            console.error(error);
            alert(error);
        })
        .finally(() => {
            actions.resetForm();
            onClose();
            return false;
        });
    }
    
    return (
        <div>
            <h1>Update the organization!</h1>
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