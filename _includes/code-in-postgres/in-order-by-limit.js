const { flatten, runQuery, output } = require('./_utils');
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
    return runQuery('select "raceId" from races where year = $1', [year]);
}


/**
 * Gets all driver standings at a given set of raceIds
 *
 * @param raceId number
 * @return Promise<MainResult[]>
 */
function qryStandings(raceId) {

    const sql = `
        select
        "driverStandings".points,
        "driverStandings"."driverId",
        2017 as year
        from "driverStandings"
        where "raceId" = $1
        `;
    return runQuery(sql, [raceId]);

}


qryRaces(2017)
    .then(orderBy('raceId', 'desc'))
    .then(limit(1))
    .then(takeOne)
    .then(qryStandings)
    .then(orderBy('points', 'desc'))
    .then(output)
    .catch(err => { console.log("ERROR:", err) });
