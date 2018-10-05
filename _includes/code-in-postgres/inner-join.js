const { runQuery, output } = require('./_utils');
const select = require('./sql-spitting-image/select');
const innerJoin = require('./sql-spitting-image/innerJoin');
const limit = require('./sql-spitting-image/limit');
const orderBy = require('./sql-spitting-image/orderBy');


/**
 * Gets results from a table
 *
 * @param table string The of a table to pull from.
 * @param column The colum to look at to decide when to include a row.
 * @param values number[] Retreive values where `column` is one of these values.
 * @return Promise<Row[]>
 */
function qryTable(table, column, values) {
    if (values.length == 0) { return []; }
    const inClause = '(' + values.map((_, i) => '$' + (i + 1)).join(",") + ')';
    const sql = `
        select *
        from "${table}"
        where "${column}" in ${inClause}`;

    return runQuery(sql, values);
}


qryTable('races', 'year', [2017])
    .then((races) => {
        return Promise.all([
            races,
            qryTable(
                'driverStandings',
                'raceId',
                races.map(r => r.raceId)
            ),
        ]);
    })
    .then(([races, driverStandings]) => {
        return Promise.all([
            races,
            driverStandings,
            qryTable(
                'drivers',
                'driverId',
                driverStandings.map(r => r.driverId)
            ),
        ]);
    })
    .then(([races, driverStandings, drivers]) => {
        return innerJoin(
            'raceId', races,
            'raceId', innerJoin(
                'driverId', driverStandings,
                'driverId', drivers
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
