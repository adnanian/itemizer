import { useState } from "react";
import { minusButtonClassName } from "../../../helpers";

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

    function handleSubmit(e) {
        e.preventDefault();
        let newQuantity = currentQuantity;
        if (className === minusButtonClassName) {
            newQuantity -= adjustment;
        } else {
            newQuantity += adjustment;
        }
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
        <div>
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