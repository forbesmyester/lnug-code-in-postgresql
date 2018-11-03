drop aggregate if exists champ_champ_points(code varchar);
drop function if exists champ_champ_points_finalfunc(acc champ_champ_points_acc);
drop function if exists champ_champ_points_sfunc(acc champ_champ_points_acc, code varchar);
drop type if exists champ_champ_points_acc;


create type champ_champ_points_acc as (year_minus_2 varchar, year_minus_1 varchar, row_points int);


create function champ_champ_points_sfunc(acc champ_champ_points_acc, code varchar)
    returns champ_champ_points_acc as
$$
    select
        acc.year_minus_1,
        code,
        case
            when code = acc.year_minus_1 and 
                code = acc.year_minus_2
                then 0
            when code = acc.year_minus_1
                then 1
            else 3
        end
$$
language sql immutable;


create function champ_champ_points_finalfunc(acc champ_champ_points_acc)
    returns int as
$$
    select acc.row_points;
$$
language sql immutable;


create aggregate champ_champ_points(code varchar) (
    sfunc = champ_champ_points_sfunc,
    stype = champ_champ_points_acc,
    initcond = '('''','''',0)',
    finalfunc = champ_champ_points_finalfunc
);




with
    the_variables (min_year) as ( values (2000) ),
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
    ),
    champions as (
        select * from final_points
        where "rank" = 1
    )
select
    surname, forename, code, year,
    champ_champ_points(code) over (order by year)
from champions
order by year asc

