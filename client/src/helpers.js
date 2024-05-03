import { useState } from "react";

const navLinkClassName = "nav-link";
const oddRow = "odd-row-num";
const evenRow = "even-row-num";
const itemImagePlaceholder = '/images/placeholder-item-image.jpg';
const updateMembershipKey = "UPDATE MEMBERSHIP", updateKeyObjSize = 2;
const removeMembershipKey = "REMOVE MEMBERSHIP";
const confirmButtonColor = 'yellow'
const confirmButtonTextColor = 'indigo';

/**
 * Returns the class name for a table row depending on
 * the parity of the number
 * 
 * @param {number} row the row number.
 * @returns {string} the even row class name if the number is even, the odd row class name otherwise.
 */
function tableRowClassName(row) {
    if (!Number.isInteger(row)) {
        throw new Error("Argument, row, must be a number.");
    }
    return row % 2 == 0 ? evenRow : oddRow;
}

/**
 * Evaluates the boolean of all given values.
 * 
 * @param  {...any} values 
 * @returns {boolean} true if all values have are falsy, false otherwise.
 */
function hasNothingness(...values) {
    return values.some((value) => !value);
}

// Used for testing purposes.
class DotProgress {
    constructor(size) {
        this.count = 0;
        this.size = size;
    }

    track() {
        if (++this.count <= this.size) {
            console.log(`${this.count} / ${this.size}`);
        }
    }

    reset() {
        this.count = 0;
    }
}

/**
 * Reference: https://betterprogramming.pub/create-a-custom-usemodal-react-hook-449b5909cc09
 * Custom hook for managing the use of dialogs and modals in React components.
 * 
 * @returns a destructured array of a boolean representing whether a modal is open, and a function to open/close the modal.
 */
const useModal = () => {
    const [modalActive, setModalActive] = useState(false);
    const toggle = () => setModalActive(!modalActive);
    return [modalActive, toggle];
}

export { 
    navLinkClassName, 
    tableRowClassName, 
    hasNothingness,
    itemImagePlaceholder, 
    DotProgress, 
    useModal, 
    updateMembershipKey,
    updateKeyObjSize,
    removeMembershipKey,
    confirmButtonColor,
    confirmButtonTextColor
}