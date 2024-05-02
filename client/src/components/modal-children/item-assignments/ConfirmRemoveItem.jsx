import { useState } from "react";

/**
 * Note: Submitting will only remove the item from the organization. The item itself will still be saved into the global system.
 * 
 * @param {*} param0 
 * @returns 
 */
export default function ConfirmRemoveItem( {assignments, onDelete, onClose } ) {
    const [selectedIndex, setSelectedIndex] = useState("");

    const assignmentOptions = [...assignments].sort((a, b) => {
        const nameA = a.item.name;
        const nameB = b.item.name;
        return nameA.localeCompare(nameB);
    }).map((assignment) => {
        return (
            <option key={assignment.id} value={assignment.id}>
                {assignment.item.name}
            </option>
        )
    });

    function handleSubmit(e) {
        e.preventDefault();
        const assignmentId = Number.parseInt(selectedIndex);
        const assignmentToDelete = assignments.find((assignment) => assignment.id === assignmentId);
        fetch(`/api/assignments/${assignmentId}`, {
            method: "DELETE"
        })
        .then(() => {
            onDelete(assignmentToDelete)
            alert(`The item, ${assignmentToDelete.item.name}, has been removed from your organization.`);
        })
        .finally(() => onClose());
    }

    return (
        <div>
            <h1>Remove Item</h1>
            <h2>Select an item to remove!</h2>
            <select onChange={(e) => setSelectedIndex(e.target.value)}>
                <option key={"None"} value={""}>Select item.</option>
                {assignmentOptions}
            </select>
            <button
                type="submit"
                disabled={!selectedIndex}
                onClick={handleSubmit}
            >
                Submit
            </button>
        </div>
    )
}