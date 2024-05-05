import { useState } from "react";

// Class name for navigational links.
const navLinkClassName = "nav-link";

// Class name to set table row to if the row number is odd.
const oddRow = "odd-row-num";

// Class name to set the table row to if the row number is even.
const evenRow = "even-row-num";

// Placeholder image for items if there is not a valid URL provided.
const itemImagePlaceholder = '/images/placeholder-item-image.jpg';

// For redirecting users from Organization.jsx to OrganizationsPage.jsx. Membership will update.
const updateMembershipKey = "UPDATE MEMBERSHIP", updateKeyObjSize = 2;

// For redirecting users from Organization.jsx to OrganizationsPage.jsx. Membership will be removed.
const removeMembershipKey = "REMOVE MEMBERSHIP";

// confirmButton properties are for inline styling of critical warnings.
const confirmButtonColor = 'yellow'
const confirmButtonTextColor = 'indigo';

// Minus and Plus buttons are for styling the buttons in AssignedItemCards.
const minusButtonClassName = "minus-button";
const plusButtonClassName = "plus-button";
    

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
    confirmButtonTextColor,
    minusButtonClassName,
    plusButtonClassName
}