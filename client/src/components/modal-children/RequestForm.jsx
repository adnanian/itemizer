import { Form, Formik } from "formik";
import * as yup from "yup";
import TextArea from "../formik-reusable/TextArea";

export default function RequestForm({ userId, orgId, orgName, onAdd, onClose }) {
    console.log(`OrgId = ${orgId}, OrgName = ${orgName}`);

    const initialValues = {
        reasonToJoin: ""
    }

    const formSchema = yup.object().shape({
        reasonToJoin: yup.string().required("Reason required").min(50)
    });

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
                                placeholder="Type here why you would like to join this organization."
                            />
                            <button disabled={props.isSubmitting} type="submit">Submit</button>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    )
}