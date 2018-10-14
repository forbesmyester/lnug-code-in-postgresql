with
    the_variables (year) as ( values (2017) ),
    last_round_of_season as (
        select races.year, max(round) as round from races
        cross join the_variables
        where races.year = the_variables.year
        group by races.year
    )
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
cross join the_variables
where races.year = the_variables.year
order by races.year desc, "driverStandings".points desc

