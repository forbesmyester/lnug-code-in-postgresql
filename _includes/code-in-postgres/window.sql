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
inner join (
    select year, max(round) as round from races group by year
    ) last_round on
        last_round."round" = races."round" and
        last_round.year = races.year
inner join drivers on drivers."driverId" = "driverStandings"."driverId"
order by races.year desc, "driverStandings".points desc
