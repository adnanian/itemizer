import { useState } from "react";
import { minusButtonClassName } from "../../../helpers";

/**
 * Creates a modal form for updating the quantity of an assigned item.
 * 
 * 
 * @param {Object} props - the props.
 * @param {String} props.className - the class name of the clicked button.
 * @param {Integer} props.currentQuantity - the current quantity for the assigned item.
 * @param {Integer} props.assignmentId - the assignment's id.
 * @param {Function} props.onUpdate - the callback function to execute when the quantity has been adjusted.
 * @param {Function} props.onClose - the callback function to execute to close the modal.
 * @returns the modal form for adjusting the assigned item's quantity.
 */
export default function AdjustQuantityForm({
    className,
    currentQuantity,
    assignmentId,
    onUpdate,
    onClose
}) {
    const [adjustment, setAdjustment] = useState(1);
    const labelName = className === minusButtonClassName ? "Items Used" : "New Received";
    const maxAdjustment = className === minusButtonClassName ? currentQuantity : (Number.MAX_SAFE_INTEGER - currentQuantity);

    //console.log(adjustment);

    /**
     * Updates the assigned item's quantity.
     * 
     * @param {*} e event.
     */
    function handleSubmit(e) {
        e.preventDefault();
        let newQuantity = currentQuantity;
        if (className === minusButtonClassName) {
            newQuantity -= adjustment;
        } else {
            newQuantity += adjustment;
        }
        // console.log(newQuantity);
        // console.log(Number.isInteger(newQuantity));
        fetch(`/api/assignments/${assignmentId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                count: newQuantity
            })
        })
            .then((response) => response.json())
            .then((data) => {
                onUpdate(data);
            })
            .finally(() => {
                setAdjustment(1);
                onClose();
            })
    }

    return (
        <div id="adjust-quantity-modal">
            <form onSubmit={handleSubmit}>
                <label htmlFor="adjustment">{labelName}</label>
                <input
                    id="adjustment"
                    name="adjustment"
                    type="number"
                    step="1"
                    min="0"
                    max={maxAdjustment}
                    value={adjustment}
                    onChange={(e) => setAdjustment(Number.parseInt(e.target.value))}
                />
                <input type="submit" />
            </form>
        </div>
    )
}