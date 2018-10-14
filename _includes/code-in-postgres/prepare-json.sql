with
    the_variables (year_count) as ( values (30) ),
    last_round_of_season as (
        select races.year, max(round) as round from races
        group by races.year
        order by year desc
        limit 30
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
    ),
    champions as (
        select * from final_points
        where "rank" = 1
        order by year
    )
select
    concat(forename, ' ', surname) as k,
    json_build_object(
        'forename', forename,
        'surname', surname,
        'count', count(year),
        'championships', jsonb_agg(year)
    ) as v
from champions
group by surname, forename
order by surname, 1
