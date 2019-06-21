const assert = require("assert");


/**
 * Given an array of Row, index them using a specific column so you can find a
 * Row quickly without having to `.find()` it.
 *
 * @param columnName keyof Row
 * @param rows Row[]
 * @return Map<Row[columnName],Row>
 */
function indexBySimple(columnName, rows) {
    return rows.reduce((acc, row) => {
        if (!row.hasOwnProperty(columnName)) { return acc; }

        const k = row[columnName];
        if (!acc.has(k)) {
            acc.set(k, []);
        }
        acc.get(k).push(row);

        return acc;
    }, new Map());
}


/**
 * Given an index, find all rows that have the value
 *
 * @param index Map<Row[columnName], Row>
 * @param value Row[columnName]
 * @return Row[]
 */
function findByIndex(value, index) {
    if (!index.has(value)) { return []; }
    return index.get(value);
}

const index = indexBySimple(
    "driverId",
    [
        { driverId: 2, forename: "Lewis", surname: "Hamilton" },
        { driverId: 14, forename: "Fernando", surname: "Alonso" }
    ]
);

assert.equal(
    findByIndex(14, index)[0].forename,
    "Fernando"
);


module.exports = { indexBySimple, findByIndex };
