const { runQuery, output } = require('./_utils');
const select = require('./sql-spitting-image/select');
const innerJoin = require('./sql-spitting-image/innerJoin');
const limit = require('./sql-spitting-image/limit');
const orderBy = require('./sql-spitting-image/orderBy');
const qryTable = require('./sql-spitting-image/qryTable');


/**
 * Gets the max rounds for all years
 *
 * @return Promise<Row[]>
 */
function lastRoundOfSeason(table, column, values) {
    return runQuery(`select year, max(round) as round from races group by year`);
}


Promise.all([qryTable('races'), lastRoundOfSeason()])
    .then(([races, lastRoundOfSeason]) => {
        return Promise.all([
            races,
            lastRoundOfSeason,
            qryTable(
                'driverStandings',
                'raceId',
                races.map(r => r.raceId)
            ),
        ]);
    })
    .then(([races, lastRoundOfSeason, driverStandings]) => {
        return Promise.all([
            races,
            lastRoundOfSeason,
            driverStandings,
            qryTable(
                'drivers',
                'driverId',
                driverStandings.map(r => r.driverId)
            ),
        ]);
    })
    .then(([races, lastRoundOfSeason, driverStandings, drivers]) => {
        return innerJoin(
            'driverId', drivers,
            'driverId', innerJoin(
                ['year', 'round'], lastRoundOfSeason,
                ['year', 'round'], innerJoin(
                    'raceId', driverStandings,
                    'raceId', races
                )
            )
        );
    })
    .then(orderBy([['year', 'desc'], ['points', 'desc']]))
    .then(select([
        ["points", "points"],
        ["code", "code"],
        ["surname", "surname"],
        ["forename", "forename"],
        ["round", "round"],
        ["year" , "year"]
    ]))
    .then(output)
    .catch(err => { console.log("ERROR:", err) });
