import { useState } from "react";
import { itemImagePlaceholder, minusButtonClassName, plusButtonClassName, useModal } from "../helpers";
import AdjustQuantityForm from "./modal-children/item-assignments/AdjustQuantityForm";
import Modal from "./Modal";

export default function AssignedItemCard({ item, addedAt, lastUpdated, quantity, assignmentId, onUpdate }) {
    const [modalActive, toggle] = useModal();
    const [className, setClassName] = useState("");

    function handleClick(e) {
        setClassName(e.target.className);
        toggle();
    }

    return (
        <>
            <div className="assigned-item">
                <img src={item.image_url || itemImagePlaceholder} alt={item.name} />
                <h4>{item.name}</h4>
                <h5>{item.partNumber}</h5>
                <p><b>{quantity}</b> Left</p>
                <p><b>Added at: </b>{addedAt}</p>
                <p><b>Last Updated: </b>{lastUpdated || "N/A"}</p>
                <textarea
                    readOnly
                    rows="5"
                    cols="20"
                    value={item.description}
                >
                </textarea>
                <div className="item-button-group">
                    <button
                        className={minusButtonClassName}
                        onClick={handleClick}
                        disabled={quantity === 0}
                    >-</button>
                    <button className={plusButtonClassName} onClick={handleClick}>+</button>
                </div>

            </div>
            <Modal openModal={modalActive} closeModal={toggle}>
                <AdjustQuantityForm
                    className={className}
                    currentQuantity={quantity}
                    assignmentId={assignmentId}
                    onUpdate={onUpdate}
                    onClose={toggle}
                />
            </Modal>
        </>
    )
}