import { useState } from "react";
import ExistingItemForm from "./ExistingItemForm";
import NewItemForm from "./NewItemForm";

/**
 * Creates a modal form allowing users to add new items to the screen.
 * This would allow users to select a radio button to view one of two
 * components: one for adding a new item to the organization AND the system,
 * and another for adding an existing item from the system to the organization.
 * 
 * @param {Object} props 
 * @param {Integer} props.orgId the organization's id.
 * @param {Array} props.items the array of items not assigned to the organization of given id.
 * @param {Function} props.onAdd the callback function to execute when adding a new item.
 * @param {Function} props.onClose the callback function to execute when closing the modal form.
 * @returns a modal child that allows the user to switch between @function NewItemForm and @function ExistingItemForm.
 */
export default function ItemFormContainer( { orgId, items, onAdd, onClose } ) {

    const formRadioValues = {
        new: "new-item-form",
        existing: "existing-item-form"
    };

    /**
     * Sets the form to display, given the selected radio button's value.
     * 
     * @param {*} e the event.
     */
    function handleChange(e) {
        setForm(e.target.value);
    }

    /**
     * Sends a request to the server to add a new assigned item to an organization.
     * 
     * @param {Object} item the item to add to the database.
     * @param {Integer} count the quantity in stock for that organization.
     * @param {Function} addItem the callback function to execute on the frontend.
     */
    function createAssignment(item, count, addItem) {
        fetch(`/api/assignments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                item_id: item.id,
                organization_id: orgId,
                count: count
            })
        })
        .then((response) => response.json())
        .then((data) => {
            if (addItem) {
                onAdd(data, item);
            } else {
                onAdd(data);
            }
        })
        .finally(() => onClose());
    }

    const formRadio = {
        [formRadioValues.new]: <NewItemForm onAdd={createAssignment}/>,
        [formRadioValues.existing]: <ExistingItemForm items={items} onAdd={createAssignment}/>
    };

    const [form, setForm] = useState(formRadioValues.new);

    return (
        <>
            <div className="radio-group">
                <input
                    id="new-item"
                    name="new-item"
                    type="radio"
                    value={formRadioValues.new}
                    onChange={handleChange}
                    checked={form===formRadioValues.new}
                />
                <span>Create a New Item</span>
                <input
                    id="existing-item"
                    name="existing-item"
                    type="radio"
                    value={formRadioValues.existing}
                    onChange={handleChange}
                    checked={form===formRadioValues.existing}
                />
                <span>Add an Existing Item</span>
            </div>
            {formRadio[form]}
        </>
    )
}