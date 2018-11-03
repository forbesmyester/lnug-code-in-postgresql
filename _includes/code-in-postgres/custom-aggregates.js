const { assoc, runQuery, output } = require('./_utils');
const groupBy = require('./sql-spitting-image/groupBy');
const select = require('./sql-spitting-image/select');
const innerJoin = require('./sql-spitting-image/innerJoin');
const limit = require('./sql-spitting-image/limit');
const orderBy = require('./sql-spitting-image/orderBy');
const qryTable = require('./sql-spitting-image/qryTable');

const sql = `
    with
        the_variables (min_year) as ( values ($1::int) ),
        last_round_of_season as (
            select races.year, max(round) as round from races
            cross join the_variables
            where races.year >= the_variables.min_year
            group by races.year
        ),
        final_points as (
            select
                "driverStandings".points,
                drivers.code,
                drivers.surname,
                drivers.forename,
                races."round",
                races.year,
                rank() over (partition by races.year order by points desc)
            from races 
            inner join "driverStandings" on races."raceId" = "driverStandings"."raceId"
            inner join last_round_of_season on
                last_round_of_season."round" = races."round" and
                last_round_of_season.year = races.year
            inner join drivers on drivers."driverId" = "driverStandings"."driverId"
            order by races.year desc, "driverStandings".points desc
        )
        select * from final_points
        where "rank" = 1
        order by year asc`

function createWindowAggregate(sFunc, initCond, finalFunc, column) {
    let acc = initCond;
    return function aggregate(rows) {
        return rows.map(row => {
            acc = sFunc(acc, row);
            return assoc(column, finalFunc(acc), row);
        });
    };
}

function champChampPointsFinalFunc(acc) {
    if (acc.years == 1) { return 3; }
    if (acc.years == 2) { return 1; }
    return 0;
}

function champChampPointsSFunc(acc, row) {
    if ((!acc.hasOwnProperty('code')) || (acc.code !== row.code)) {
        return { code: row.code, years: 1 };
    }
    return { code: acc.code, years: acc.years + 1 };
}

runQuery(sql, [2000])
    .then(createWindowAggregate(
        champChampPointsSFunc,
        {},
        champChampPointsFinalFunc,
        'champ_champ_points'
    ))
    .then(output)
    .catch(err => { console.log("ERROR:", err); process.exit(1) });




