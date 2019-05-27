const { indexBy, generateIndexByKey } = require('./_indexBy');


/**
 * We have both results so join Using `circuitId`, create an index on
 * `circuitResults` and then map over `raceResults pulling that data in.
 *
 * @param colOrColsA string|string[] A key within resultA
 * @param resultsA Row[]
 * @param colOrColsB string|string[] A key within resultB
 * @param resultsB Row[]
 * @return Row[]
 */
function innerJoin(colOrColsA, resultsA, colOrColsB, resultsB) {

    function joinRows(row, otherRows) {
        return otherRows.map(otherRow => {
            return {...otherRow, ...row};
        });
    }

    const indexedResultsB = indexBy(colOrColsB, resultsB);

    let results = [];
    for (let rowA of resultsA) {
        let searchKey = generateIndexByKey(colOrColsA, rowA);
        if (indexedResultsB.has(searchKey)) {
            results = results.concat(
                joinRows(rowA, indexedResultsB.get(searchKey))
            );
        }
    }
    return results;
}

module.exports = innerJoin;
