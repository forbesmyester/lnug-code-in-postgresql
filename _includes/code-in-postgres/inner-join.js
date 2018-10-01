let { runQuery, output } = require('./_utils');


/**
 * interface Row { [ columnName: string ]: any; }
 * interface HasCircuitId extends Row { circuitId: number; }
 * interface RaceResult extends HasCircuitId {
 *   round: number;
 *   name: string;
 * }
 * interface CircuitResult extends HasCircuitId {
 *   country: string;
 *   location: string;
 * }
 * interface MainResult extends RaceResult, CircuitResult {}
 */


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

/**
 * Given a field name and an object, it will try to retrieve that field from the
 * object.
 *
 * @param fld string
 * @param obj {}
 * @return any
 */
function get(fld, ob) {
    if (ob && ob[fld]) {
        return ob[fld];
    }
    return null;
}

/**
 * We have both results so join Using `circuitId`, create an index on
 * `circuitResults` and then map over `raceResults pulling that data in.
 *
 * @param [raceResults] RaceResult[]
 * @param [circuitResults] CircuitResult[]
 * @return MainResult
 */
function perforJoin([racesResults, circuitResults]) => {
    const indexedCircuitResults = indexBy('circuitId', circuitResults);
    return racesResults.map(raceRow => {
        return {
            round: raceRow.round,
            name: raceRow.name,
            country: get('country', indexedCircuitResults[raceRow.circuitId]),
            location: get('location', indexedCircuitResults[raceRow.circuitId])
        };
    });
}

qryRaces(2017) // Get races results
    .then(racesResults => { // Also get results about the races circuits
        return Promise.all([
            racesResults,
            qryCircuits(racesResults.map(({circuitId}) => circuitId))
        ]);
    })
    .then(performJoin)
    .then(output)
    .catch(err => { console.log("ERROR:", err) });
