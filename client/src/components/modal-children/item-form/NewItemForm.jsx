import { Form, Formik } from "formik";
import * as yup from "yup";
import Input from "../../formik-reusable/Input";
import TextAreaInput from "../../formik-reusable/TextAreaInput";

export default function NewItemForm({ onAddAssignment }) {
    const initialValues = {
        name: "",
        description: "",
        partNumber: "",
        imageUrl: "",
        count: 0,
    };

    const formSchema = yup.object().shape({
        name: yup.string().required("Item name required").max(200),
        description: yup.string().optional().max(500),
        partNumber: yup.string().optional(),
        image: yup.mixed().required('required').test('fileFormat', 'Only JPEG or PNG files are allowed', value => {
            if (value) {
                const supportedFormats = ['jpg', 'jpeg', 'png'];
                return supportedFormats.includes(value.name.split('.').pop());
            }
            return true;
        }),
        count: yup.number().integer().min(0).required("Must be a non-negative integer.")
    });

    function handleSubmit(e, values, actions) {
        e.preventDefault();
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
                onAddAssignment(data.id, count);
                alert("New item added to the system.");
                onClose();
            } else {
                throw new Error(data);
            }
        })
        .catch((error) => {
            console.error(error);
        })
        .finally(() => actions.resetForm());
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
                            <TextAreaInput
                                label="Description"
                                id="description"
                                name="description"
                                rows="5"
                                cols="50"
                                placeholder="Describe the item here. (Optional, but HIGHLY RECOMMENDED!)"
                            />
                            <Input
                                label="Part Number"
                                id="partNumber"
                                name="partNumber"
                                type="text"
                                placeholder="Enter the part number (optional)."
                            />
                            <Input
                                label="Image URL"
                                id="partNumber"
                                name="partNumber"
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