import { Form, Formik } from "formik";
import * as yup from "yup";
import TextArea from "../../formik-reusable/TextArea";

/**
 * Creates a modal form allowing a user to submit a request to join an organization.
 * All the user would have to do is explain in at least 50 characters, why he/she wishes
 * to be part of the organization.
 * 
 * @param {Object} props 
 * @param {Integer} props.userId the current user's id.
 * @param {Integer} props.orgId the id of the organization that the user is requesting to join.
 * @param {String} props.orgName the name of the organization that the user is requesting to join.
 * @param {Function} props.onAdd the callback function to execute after a request to join the organization has been added to the server.
 * @param {Function} props.onClose the callback function to execute to close the modal.
 * @returns a modal form for the user to request joining.
 */
export default function RequestForm({ userId, orgId, orgName, onAdd, onClose }) {
    //console.log(`OrgId = ${orgId}, OrgName = ${orgName}`);

    const initialValues = {
        reasonToJoin: ""
    }

    const formSchema = yup.object().shape({
        reasonToJoin: yup.string().required("Reason required").min(50)
    });

    /**
     * Creates a new request and adds it to the system.
     * 
     * @param {*} values the values from Formik.
     * @param {*} actions Formik actions.
     * @returns false so that the web app does not refresh.
     */
    function handleSubmit(values, actions) {
        fetch("/api/requests", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user_id: userId,
                organization_id: orgId,
                reason_to_join: values.reasonToJoin
            })
        })
            .then((response) => response.json().then((data) => (
                { data, status: response.status }
            )))
            .then(({ data, status }) => {
                if (status === 201) {
                    onAdd(data);
                    alert("Request submitted! You will be notified whether you've been accepted.");
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
            })
    }

    return (
        <div>
            <h1>Submit request to join "{orgName}"!</h1>
            <Formik
                initialValues={initialValues}
                validationSchema={formSchema}
                onSubmit={handleSubmit}
            >
                {(props) => {
                    return (
                        <Form>
                            <TextArea
                                label="Message: "
                                id="reasonToJoin"
                                name="reasonToJoin"
                                rows="5"
                                cols="50"
                                placeholder="Type here why you would like to join this organization. (Min: 50 characters)"
                            />
                            <span>{`${props.values.reasonToJoin.length} characters`}</span>
                            <button disabled={props.isSubmitting} type="submit">Submit</button>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    )
}