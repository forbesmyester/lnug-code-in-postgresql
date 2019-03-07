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
 * @param raceIds number[]
 * @return Promise<MainResult[]>
 */
function qryStandings(raceIds) {

    const promises = raceIds.map((raceId) => {
        const sql = `
            select
            "driverStandings".points,
            "driverStandings"."driverId",
            2017 as year
            from "driverStandings"
            where "raceId" = $1
            `;
        return runQuery(sql, [raceId]);
    });

    return Promise.all(promises).then(flatten);
}


qryRaces(2017)
    .then(racesResults => {
        return qryStandings(racesResults.map(({raceId}) => raceId));
    })
    .then(orderBy('points', 'desc'))
    .then(limit(1))
    .then(output)
    .catch(err => { console.log("ERROR:", err) });
