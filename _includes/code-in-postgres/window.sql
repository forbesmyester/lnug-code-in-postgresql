
select
    races.year,
    "races"."round",
    "driverStandings".points,
    drivers.code,
    drivers.surname,
    drivers.forename,
    rank() over (partition by year, "races"."round" order by "driverStandings"."raceId" desc, points desc)
from "driverStandings"
inner join drivers on drivers."driverId" = "driverStandings"."driverId"
inner join races on races."raceId" = "driverStandings"."raceId"
where year = 1994
order by races.year desc, "races"."round" asc, "driverStandings".points desc
