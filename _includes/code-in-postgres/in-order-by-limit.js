const { takeOne, runQuery, output } = require('./_utils');
const limit = require('./sql-spitting-image/limit');
const select = require('./sql-spitting-image/select');
const orderBy = require('./sql-spitting-image/orderBy');
const orderByMulti = require('./sql-spitting-image/orderByMulti');


/**
 * interface RaceResult { round: number; raceId: number; }
 * interface MainResult { points: number; driverId: number; year: number; }
 */


/**
 * Get data from the `results` table.
 *
 * @param year number
 * @return Promise<RaceResult[]>
 */
function qryRaces(year) {
    return runQuery('select "round", "raceId" from races where year = $1', [year]);
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
    .then(orderBy('round', 'desc'))
    .then(limit(1))
    .then((rounds) => rounds.map(r => r.raceId))
    .then(takeOne)
    .then(qryStandings)
    .then(orderByMulti([['points', 'desc'], ['driverId', 'asc']]))
    .then(select([
        ["points", "points"],
        ["driverId", "driverId"],
        ["year" , "year"]
    ]))
    .then(output)
    .catch(err => {
        console.log("ERROR:", err);
        process.exit(1);
    });
