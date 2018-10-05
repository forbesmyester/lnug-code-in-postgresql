select
    "driverStandings".points,
    "driverStandings"."driverId",
    2017 as year
from "driverStandings"
where "raceId" in (select "raceId" from races where year = 2017)
order by "driverStandings".points desc
limit 1

