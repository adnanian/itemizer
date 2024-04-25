import { useState } from "react";
import ExistingItemForm from "./ExistingItemForm";
import NewItemForm from "./NewItemForm";

export default function ItemFormContainer( { orgId, items, onAdd, onClose } ) {

    const formRadioValues = {
        new: "new-item-form",
        existing: "existing-item-form"
    };

    const formRadio = {
        [formRadioValues.new]: <NewItemForm onAdd={onAdd}/>,
        [formRadioValues.existing]: <ExistingItemForm items={items} onAdd={onAdd}/>
    };

    const [form, setForm] = useState(formRadioValues.new);

    function handleChange(e) {
        setForm(e.target.value);
    }

    function createAssignment(itemId, count) {
        // TODO
    }

    return (
        <>
            <div>
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