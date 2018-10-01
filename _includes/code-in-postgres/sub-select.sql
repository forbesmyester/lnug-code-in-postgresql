
select 
    max_championship_points.year,
    drivers.code,
    drivers.suername
from (
    select
        races.year,
        max("driverStandings".points) as points
    from races
    inner join "driverStandings" on races."raceId" = "driverStandings"."raceId"
    group by races.year
) max_championship_points
inner join "driverStandings" on
    max_championship_points.points = "driverStandings".points and 
    max_championship_points.year = "driverStandings".year
inner join drivers on drivers."driverId" = "driverStandings"."driverId"


    "driverStandings".points,
    nth_value(drivers.code, 1) over (partition by year order by  desc)
where year = 2017
