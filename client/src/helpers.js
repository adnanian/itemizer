import { useState } from "react";

const navLinkClassName = "nav-link";
const oddRow = "odd-row-num";
const evenRow = "even-row-num";
const itemImagePlaceholder = '/placeholder-item-image.jpg';
const updateMembershipKey = "UPDATE MEMBERSHIP", updateKeyObjSize = 2;
const removeMembershipKey = "REMOVE MEMBERSHIP";

/**
 * TODO
 * 
 * @param {*} row 
 * @returns 
 */
function tableRowClassName(row) {
    if (!Number.isInteger(row)) {
        throw new Error("Argument, row, must be a number.");
    }
    return row % 2 == 0 ? evenRow : oddRow;
}

/**
 * TODO
 * 
 * @param  {...any} values 
 * @returns 
 */
function hasNothingness(...values) {
    return values.some((value) => !value);
}

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
 * 
 * 
 * @returns 
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
    removeMembershipKey 
}