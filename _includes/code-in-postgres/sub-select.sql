select
    "driverStandings".points,
    drivers.code,
    drivers.surname,
    drivers.forename,
    races."round",
    races.year
from races 
inner join "driverStandings" on races."raceId" = "driverStandings"."raceId"
inner join drivers on drivers."driverId" = "driverStandings"."driverId"
inner join (
    select year, max(round) as round from races group by year
    ) last_round on
        last_round."round" = races."round" and
        last_round.year = races.year
/*
Causes the sub select to be optimized also
where races.year = 2017
 */
order by races.year desc, "driverStandings".points desc

