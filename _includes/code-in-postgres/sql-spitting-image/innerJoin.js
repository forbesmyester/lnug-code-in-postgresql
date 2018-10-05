const indexBy = require('./_indexBy');
let assert = require('assert');


/**
 * We have both results so join Using `circuitId`, create an index on
 * `circuitResults` and then map over `raceResults pulling that data in.
 *
 * @param columnA string A key within resultA
 * @param resultsA Row[]
 * @param columnB string A key within resultB
 * @param resultsB Row[]
 * @return Row[]
 */
function innerJoin(columnA, resultsA, columnB, resultsB) {

    function flattenOne(arr) {
        let r = [];
        arr.forEach(ar => {
            ar.forEach(a => {
                r.push(a);
            })
        });
        return r;
    }

    function joinRows(otherRows) {
        return function(row) {
            let rowKeys = Object.keys(row);
            return otherRows.map(otherRow => {
                let result = {...otherRow};
                rowKeys.map(rk => {
                    result[rk] = row[rk];
                });
                return result;
            });
        }
    }

    const indexedResultsA = indexBy(columnA, resultsA);
    const indexedResultsB = indexBy(columnB, resultsB);

    return Object.keys(indexedResultsA).reduce(
        (acc, key) => {
            if (!indexedResultsB.hasOwnProperty(key)) {
                return acc;
            }
            return acc.concat(
                flattenOne(indexedResultsA[key].map(
                    joinRows(indexedResultsB[key])
                ))
            );
        },
        []
    )
}

// No results when nothing matches
assert.deepEqual(
    innerJoin(
        'id',
        [{ id: "x", name: "Jack"}],
        "driverId",
        [{driverId: "y", race: "Silverstone 1981 GP"}]
    ),
    []
);


// Has Results
assert.deepEqual(
    innerJoin(
        'id',
        [{ id: "x", name: "Jack"}, { id: "y", name: "Sterling"}],
        'driverId',
        [
            {driverId: "y", race: "Silverstone 1981 GP"},
            {driverId: "y", race: "Spa GP 1982"}
        ]
    ),
    [
        {driverId: "y", race: "Silverstone 1981 GP", id: "y", name: "Sterling"},
        {driverId: "y", race: "Spa GP 1982", id: "y", name: "Sterling"}
    ]
);


module.exports = innerJoin;
