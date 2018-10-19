const { runQuery, output } = require('./_utils');
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
        order by year`;

function concat(acc, item) {
    return acc.concat([item]);
}

runQuery(sql, [2010])
    .then(results => {
        return groupBy(
            ['forename', 'surname'],
            [
                { fun: concat, col: 'year', out: 'championships', init: [] }
            ]
        )(results);
    })
    .then(output)
    .catch(err => { console.log("ERROR:", err) });



