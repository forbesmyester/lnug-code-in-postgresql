const assert = require("assert");


const drivers = [
    { driverId: 2, forename: "Lewis", surname: "Hamilton" },
    { driverId: 14, forename: "Fernando", surname: "Alonso" }
];


/**
 * Find one `row` within rows that has `value` within the specified `column`.
 *
 * @param column string The property within the rows to look within.
 * @param value number|string The value that column (above) should be.
 * @param rows Row[] An array of objects to represent rows.
 * @return Row
 */
function arrayFind(column, value, rows) {
    return rows.find((row) => {
        return row[column] == value;
    });
}


assert.equal(arrayFind("driverId", 14, drivers).forename, "Fernando");


module.exports = arrayFind;
