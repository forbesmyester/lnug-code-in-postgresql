const { output } = require('./_utils');
const select = require('./sql-spitting-image/select');
const orderBy = require('./sql-spitting-image/orderBy');
const limit = require('./sql-spitting-image/limit');
const qryTable = require('./sql-spitting-image/qryTable');
const innerJoin = require('./sql-spitting-image/innerJoin');

let promises = [
    qryTable('races', 'year', [2017]),
    qryTable('driverStandings'),
    qryTable('drivers')
];

Promise.all(promises)
    .then(([races, driverStandings, drivers]) => {
        return innerJoin(
            'driverId', drivers,
            'driverId', innerJoin(
                'raceId', driverStandings,
                'raceId', races
            )
        );
    })
    .then(orderBy('points', 'desc'))
    .then(limit(1))
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
