const assert = require("assert");


/**
 * Given an array or Row, index them using a specific column so you can find a
 * Row quickly without having to `.find()` it.
 *
 * @param columnName string
 * @param rows Row[]
 * @return Map<Row[columnName],Row>
 */
function indexBySimple(columnName, rows) {
    return rows.reduce((acc, row) => {
        if (!row.hasOwnProperty(columnName)) { return acc; }

        let k = row[columnName];
        if (!acc.has(k)) {
            acc.set(k, []);
        }
        acc.get(k).push(row);

        return acc;
    }, new Map());
}


assert.equal(
    indexBySimple(
        "driverId",
        [
            { driverId: 2, forename: "Lewis", surname: "Hamilton" },
            { driverId: 14, forename: "Fernando", surname: "Alonso" }
        ]
    ).get(14)[0].forename,
    "Fernando"
);


module.exports = indexBySimple;
