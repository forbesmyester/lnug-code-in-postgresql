
select
    "driverStandings".points,
    drivers.code,
    drivers.surname,
    drivers.forename,
    races.round,
    races.year
from races 
inner join "driverStandings" on races."raceId" = "driverStandings"."raceId"
inner join drivers on drivers."driverId" = "driverStandings"."driverId"
where races.year = 2017
order by "driverStandings".points desc
limit 1

