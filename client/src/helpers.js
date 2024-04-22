const navLinkClassName = "nav-link";
const oddRow = "odd-row-num";
const evenRow = "even-row-num";

function tableRowClassName(row) {
    if (!Number.isInteger(row)) {
        throw new Error("Argument, row, must be a number.");
    }
    return row % 2 == 0 ? evenRow : oddRow;
}

export {navLinkClassName, tableRowClassName}