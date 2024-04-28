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

class ModalOpener {
    constructor(key, modal) {
        this.key = key;
        this.modal = modal;
    }
}

export {navLinkClassName, tableRowClassName, hasNothingness, notify, itemImagePlaceholder, ModalOpener}