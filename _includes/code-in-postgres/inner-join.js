const { output } = require('./_utils');
const select = require('./sql-spitting-image/select');
const orderBy = require('./sql-spitting-image/orderBy');
const orderByMulti = require('./sql-spitting-image/orderByMulti');
const limit = require('./sql-spitting-image/limit');
const qryTable = require('./sql-spitting-image/qryTable');
const innerJoinSimple = require('./sql-spitting-image/innerJoinSimple');

function addStatic(data) {
    return function addStaticImpl(rows) {
        return rows.map(r => {
            return {...r, ...data};
        });
    };
}

qryTable('races', 'year', [2017])
    .then(orderBy('round', 'desc'))
    .then(limit(1))
    .then((races) => races.map(r => r.raceId))
    .then((raceIds) => {
        return Promise.all([
            qryTable('driverStandings', 'raceId', raceIds),
            qryTable('drivers') // might as well do in parallel!
        ]);
    })
    .then(([driverStandings, drivers]) => {
        return innerJoinSimple(
            driverStandings,
            ['driverId', 'driverId'],
            drivers
        );
    })
    .then(orderByMulti([['points', 'desc'], ['driverId', 'asc']]))
    .then(select([
        ['points', 'points'],
        ['driverId', 'driverId'],
        ['forename', 'forename'],
        ['surname', 'surname']
    ]))
    .then(addStatic({year: 2017}))
    .then(output)
    .catch(err => { console.log("ERROR:", err) });
