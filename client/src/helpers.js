import { useState } from "react";

const navLinkClassName = "nav-link";
const oddRow = "odd-row-num";
const evenRow = "even-row-num";
const itemImagePlaceholder ='/placeholder-item-image.jpg';

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

function notify(text) {
    if ("Notification" in window) {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                new Notification(text);
            } else {
                console.log("Notification permission denied.");
            }
        });
    } else {
        console.log("Notification NOT in window! :(")
    }
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

class ModalOpener {
    constructor(key, modal) {
        this.key = key;
        this.modal = modal;
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

export {navLinkClassName, tableRowClassName, hasNothingness, notify, itemImagePlaceholder, ModalOpener, DotProgress, useModal}