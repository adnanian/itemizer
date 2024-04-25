import { Form, Formik } from "formik";
import * as yup from "yup";
import Select from "../../formik-reusable/Select";
import Input from "../../formik-reusable/Input";
import { hasNothingness, itemImagePlaceholder } from "../../../helpers";

export default function ExistingItemForm( { items, onAdd } ) {
    const initialValues = {
        selectedItemId: "", // Selected item index
        eCount: 0 // added the lowercase 'e' for "Existing items", "count" already exsits for NewItemForm.jsx
    }

    const validationSchema = yup.object().shape({
        selectedItemId: yup.string().oneOf(items.map(item => item.id.toString()), "Invalid selection").required("Required"),
        eCount: yup.number().integer().min(0).required("Must be a non-negative integer.")
    });

    const itemOptions = items.map((item) => {
        return (
            <option key={item.id} value={item.id}>{item.name}</option>
        )
    });

    function handleSubmit(values, actions) {
        onAdd(items.find(item => item.id == values.selectedItemId), values.eCount, false);
        alert("Item has been added to the organization.");
        actions.resetForm();
        return false;
    }

    //console.log(items);

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
                    let itemId = (value = props.values.selectedItemId) ? Number.parseInt(value) : value;
                    let item = items.find((item) => item.id === itemId);
                    //console.log(value);
                    //console.log(item);
                    return (
                        <Form>
                            <Select
                                label="Items Not Assigned"
                                id="non-assign"
                                name="selectedItemId"
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
                            <button disabled={props.isSubmitting || hasNothingness(itemOptions.length, props.values.selectedItemId)} type="submit">Submit</button>
                        </Form>
                    )
                }}
            </Formik>
        </div>
    )
}