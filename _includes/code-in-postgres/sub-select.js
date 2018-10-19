const { runQuery, output } = require('./_utils');
const select = require('./sql-spitting-image/select');
const innerJoin = require('./sql-spitting-image/innerJoin');
const limit = require('./sql-spitting-image/limit');
const orderBy = require('./sql-spitting-image/orderBy');
const qryTable = require('./sql-spitting-image/qryTable');


let promises = [
    qryTable('races'),
    qryTable('driverStandings'),
    qryTable('drivers'),
    runQuery(`select year, max(round) as round from races group by year`)
];


Promise.all(promises)
    .then(([races, driverStandings, drivers, lastRoundOfSeason]) => {
        return innerJoin(
            ['round', 'year'], lastRoundOfSeason,
            ['round', 'year'], innerJoin(
                'driverId', drivers,
                'driverId', innerJoin(
                    'raceId', driverStandings,
                    'raceId', races
                )
            )
        );
    })
    .then(select([
        ["points", "points"],
        ["code", "code"],
        ["surname", "surname"],
        ["forename", "forename"],
        ["round", "round"],
        ["year" , "year"]
    ]))
    .then(orderBy([['year', 'desc'], ['points', 'desc']]))
    .then(output)
    .catch(err => { console.log("ERROR:", err) });

