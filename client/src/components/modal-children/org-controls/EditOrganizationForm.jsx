import { Form, Formik } from "formik";
import * as yup from "yup";
import Input from "../../formik-reusable/Input";
import TextArea from "../../formik-reusable/TextArea";

export default function EditOrganizationForm( {orgId, orgName, orgDescription, onUpdate, onClose} ) {
    const initialValues = {
        name: orgName,
        description: orgDescription
    }

    const formSchema = yup.object().shape({
        name: yup.string().required("Name required."),
        description: yup.string().min(50).required("Describe your organization with at least 50 characters.")
    });

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