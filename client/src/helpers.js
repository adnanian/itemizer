const navLinkClassName = "nav-link";
const oddRow = "odd-row-num";
const evenRow = "even-row-num";

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
    return values.some((value) => value === null || value === undefined);
}

export {navLinkClassName, tableRowClassName, hasNothingness}