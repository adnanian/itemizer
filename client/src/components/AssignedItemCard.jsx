import { useState } from "react";
import { itemImagePlaceholder, minusButtonClassName, plusButtonClassName, useModal } from "../helpers";
import AdjustQuantityForm from "./modal-children/item-assignments/AdjustQuantityForm";
import Modal from "./Modal";

/**
 * Displays all the information, with the exception of part #, of an item in a card, including the quantity that
 * the current organization has.
 * Also rendered are two buttons for any member to adjust the quantity of the assigned item for their inventory.
 * 
 * WARNING: THIS COMPONENT IS MEANT TO RENDER UNDER THE Organization PAGE. DO NOT CONFUSE THIS
 * WITH ItemCard, WHICH IS MEANT TO BE RENDERED UNDER THE Home PAGE.
 * 
 * @param {Object} props 
 * @param {Object} props.item the item object.
 * @param {String} props.addedAt the date and time the item type was assigned to an organization.
 * @param {String} props.lastUpdated the date and time the assigned item's information was updated to the server.
 * @param {Integer} props.quantity the quantity of the assigned item type.
 * @param {Integer} props.assignmentId the id of the assigned item.
 * @param {Function} props.onUpdate the callback function to execute after an assigned item's information has been updated to the server.
 * @returns an item card consisting of its information.
 */
export default function AssignedItemCard({ item, addedAt, lastUpdated, quantity, assignmentId, onUpdate }) {
    const [modalActive, toggle] = useModal();
    const [className, setClassName] = useState("");

    /**
     * Opens a modal that displays the AdjustQuantityForm. 
     * 
     * @param {*} e the event.
     */
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