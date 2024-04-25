import { Form, Formik, validateYupSchema } from "formik";
import * as yup from "yup";
import Select from "../../formik-reusable/Select";
import Input from "../../formik-reusable/Input";
import { itemImagePlaceholder } from "../../../helpers";

export default function ExistingItemForm( { items, onAdd } ) {
    const initialValues = {
        selectedItem: "",
        eCount: 0
    }

    const validationSchema = yup.object().shape({
        selectedItem: yup.string().oneOf(items.map(item => item.id), "Invalid selection").required("Required"),
        eCount: yup.number().integer().min(0).required("Must be a non-negative integer.")
    });

    const itemOptions = items.map((item) => {
        return (
            <option key={item.id} value={item.id}>{item.name}</option>
        )
    });

    function handleSubmit(e, values, actions) {
        e.preventDefault();
        onAdd(values.selectedItem);
        alert("Item has been added to the organization.");
        actions.resetForm();
    }

    return (
        <div className="add-item-modal">
            <h1>Select Existing Item</h1>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {(props) => {
                    let value;
                    let itemId = (value = props.values.selectedItem) ? Number.parseInt(value) : value;
                    let item = items.find((item) => item.id === itemId);
                    return (
                        <Form>
                            <Select
                                label="Items Not Assigned"
                                id="non-assign"
                                name="selectedItem"
                                placeholder="Select an existing item."
                            >
                                <option key="None" value="">Select an existing item</option>
                                {itemOptions}
                            </Select>
                            <Input
                                label="Initial Quantity"
                                id="eCount"
                                name="eCount"
                                type="number"
                                step="1"
                                min="0"
                                placeholder="How many of this item do you have?"
                            />
                            <img src={item?.image_url || itemImagePlaceholder} alt="Add alt here" className="modal-image"/>
                            <p>{item?.part_number || ""}</p>
                            <p>{item?.description || ""}</p>
                            <button disabled={props.isSubmitting} type="submit">Submit</button>
                        </Form>
                    )
                }}
            </Formik>
        </div>
    )
}