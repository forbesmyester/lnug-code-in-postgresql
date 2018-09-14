let { runQuery, output } = require('./_utils');

/* interface Row { [ columnName: string ]: any; } */

/**
 * Get data from the `results` table.
 *
 * @param year number
 * @return Promise<Row[]>
 */
function qryRaces(year) {
    return runQuery(
        'select round, name, "circuitId" from races where year = $1',
        [year]
    );
}

/**
 * Given a set of `circuitIds`, gets data about them from the `results` table.
 *
 * @param circuitIds number[]
 * @return Promise<Row[]>
 */
function qryCircuits(circuitIds) {
    if (circuitIds.length == 0) { return []; }
    const inClause = '(' + circuitIds.map((_, i) => '$' + (i + 1)).join(",") + ')';
    const sql = `
        select country, location, "circuitId" from circuits
        where "circuitId" in ${inClause}`;

    return runQuery(sql, circuitIds);
}

/**
 * Given an array or Row, looks at the data and indexes them by a specific
 * columnName so you can find a Row quickly without having to `.find()` it.
 *
 * @param columnName string
 * @param results Row[]
 * @return {[columnName: string]: Row}
 */
function indexBy(columnName, results) {
    return results.reduce((acc, row) => {
        acc[row[columnName]] = row;
        return acc;
    }, {});
}

qryRaces(2017) // Get races results
    .then(racesResults => { // Also get results about the races circuits
        return Promise.all([
            racesResults,
            qryCircuits(racesResults.map(({circuitId}) => circuitId))
        ]);
    })
    .then(([racesResults, circuitResults]) => { // We have both results so join
        // Using `circuitId`, create an index on `circuitResults` and then map
        // over `raceResults pulling that data in.
        const indexedCircuitResults = indexBy('circuitId', circuitResults);
        return racesResults.map(raceRow => {
            return {
                round: raceRow.round,
                name: raceRow.name,
                country: indexedCircuitResults[raceRow.circuitId].country,
                location: indexedCircuitResults[raceRow.circuitId].location,
            };
        });
    })
    .then(output)
    .catch(err => { console.log("ERROR:", err) });
