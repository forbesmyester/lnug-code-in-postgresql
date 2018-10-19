with
    the_variables (min_year) as ( values (2010) ),
    last_round_of_season as (
        select races.year, max(round) as round from races
        cross join the_variables
        where races.year >= the_variables.min_year
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
order by races.year desc, "driverStandings".points desc

