let { runQuery, output } = require('./_utils');
const limit = require('./sql-spitting-image/limit');
const orderBy = require('./sql-spitting-image/orderBy');


/**
 * interface RaceResult { round: number; }
 * interface MainResult { points: number; driverId: number; year: number; }
 */


/**
 * Get data from the `results` table.
 *
 * @param year number
 * @return Promise<RaceResult[]>
 */
function qryRaces(year) {
    return runQuery(
        'select "raceId" from races where year = $1',
        [year]
    );
}


/**
 * Gets all driver standings at a given set of raceIds
 *
 * @param raceIds number[]
 * @return Promise<MainResult[]>
 */
function qryMain(raceIds) {
    if (raceIds.length == 0) { return []; }
    const inClause = '(' + raceIds.map((_, i) => '$' + (i + 1)).join(",") + ')';
    const sql = `
        select
            "driverStandings".points,
            "driverStandings"."driverId",
            2017 as year
        from "driverStandings"
        where "raceId" in ${inClause}`;

    return runQuery(sql, raceIds);
}


qryRaces(2017)
    .then(racesResults => {
        return qryMain(racesResults.map(({raceId}) => raceId));
    })
    .then(orderBy('points', 'desc'))
    .then(limit(1))
    .then(output)
    .catch(err => { console.log("ERROR:", err) });
