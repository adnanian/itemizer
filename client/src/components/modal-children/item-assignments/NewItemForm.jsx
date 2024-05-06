import { Form, Formik } from "formik";
import * as yup from "yup";
import Input from "../../formik-reusable/Input";
import TextAreaInput from "../../formik-reusable/TextArea";

/**
 * Creates a form that allows users to manually enter item information
 * to add a new item to an organization AND the system itself.
 * 
 * @param {Function} onAdd the callback function to execute when adding an item.
 * @returns a form allowing users to manually add information about an item to the system.
 */
export default function NewItemForm({ onAdd }) {
    const maxNameLength = 200;
    const maxDescLength = 500;

    const initialValues = {
        name: "",
        description: "",
        partNumber: "",
        imageUrl: "",
        count: 0,
    };

    const formSchema = yup.object().shape({
        name: yup.string().required("Item name required").max(maxNameLength),
        description: yup.string().optional().max(maxDescLength),
        partNumber: yup.string().optional(),
        imageUrl: yup.string().optional("RECOMMENDED"),
        count: yup.number().integer().min(0).required("Must be a non-negative integer.")
    });

    /**
     * Creates a new item and adds it to the system.
     * 
     * @param {*} values the values from Formik.
     * @param {*} actions Formik actions.
     * @returns false so that the web app does not refresh.
     */
    function handleSubmit(values, actions) {
        fetch("/api/items", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: values.name,
                description: values.description,
                part_number: values.partNumber,
                image_url: values.imageUrl
            })
        })
        .then((response) => response.json().then((data) => (
            {data, status: response.status}
        )))
        .then(({data, status}) => {
            if (status === 201) {
                onAdd(data, values.count, true);
                alert("New item added to the system.");
            } else {
                throw new Error(data.message);
            }
        })
        .catch((error) => {
            console.error(error);
            alert(error);
        })
        .finally(() => {
            actions.resetForm();
            return false;
        });
    }

    return (
        <div className="add-item-modal" >
            <h1>Add New Item</h1>
            <Formik
                initialValues={initialValues}
                validationSchema={formSchema}
                onSubmit={handleSubmit}
            >
                {(props) => {
                    return (
                        <Form>
                            <Input
                                label="Name"
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Enter the name of the item. BE PRECISE!"
                            />
                            <span>{`${props.values.name.length} / ${maxNameLength} characters`}</span>
                            <TextAreaInput
                                label="Description"
                                id="description"
                                name="description"
                                rows="5"
                                cols="50"
                                placeholder="Describe the item here. (Optional, but HIGHLY RECOMMENDED!)"
                            />
                            <span>{`${props.values.description.length} / ${maxDescLength} characters`}</span>
                            <Input
                                label="Part Number"
                                id="partNumber"
                                name="partNumber"
                                type="text"
                                placeholder="Enter the part number (optional)."
                            />
                            <Input
                                label="Image URL"
                                id="imageUrl"
                                name="imageUrl"
                                type="text"
                                placeholder="Paste the image address here."
                            />
                            <Input
                                label="Initial Quantity"
                                id="count"
                                name="count"
                                type="number"
                                step="1"
                                min="0"
                                placeholder="How many of this item do you have?"
                            />
                            <button disabled={props.isSubmitting} type="submit">Submit</button>
                        </Form>
                    )
                }}
            </Formik>
        </div>
    )
}