import { useState } from "react";
import ExistingItemForm from "./ExistingItemForm";
import NewItemForm from "./NewItemForm";

export default function ItemFormContainer( { orgId, items, onAdd, onClose } ) {

    const formRadioValues = {
        new: "new-item-form",
        existing: "existing-item-form"
    };

    function handleChange(e) {
        setForm(e.target.value);
    }

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