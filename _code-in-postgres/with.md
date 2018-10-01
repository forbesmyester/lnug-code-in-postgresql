## Where, Order and Limit

Who knows...
     * SQL?
     * WHERE
     * ORDER
     * LIMIT
     * IN
     * INNER JOIN


## Inner Join


select
    "driverStandings".points,
    drivers.code,
    drivers.surname,
    drivers.forename,
    races.round,
    races.year
from "driverStandings"
inner join races on races."raceId" = "driverStandings"."raceId"
inner join drivers on drivers."driverId" = "driverStandings"."driverId"
where races.year = 2017
order by "driverStandings".points desc
limit 1


    select year, "round" as round from races
    where year = 2017
    order by round desc limit 1


## Group


    select year, max(round) as round from races group by year


## Sub Select

select
    "driverStandings".points,
    drivers.code,
    drivers.surname,
    drivers.forename,
    races."round",
    races.year
from "driverStandings"
inner join races on races."raceId" = "driverStandings"."raceId"
inner join (
    select year, max(round) as round
    from races group by year
    ) last_round on
        last_round."round" = races."round" and
        last_round.year = races.year
inner join drivers on drivers."driverId" = "driverStandings"."driverId"
order by races.year desc, "driverStandings".points desc

## Window

add rank

explain analyze

select
    "driverStandings".points,
    drivers.code,
    drivers.surname,
    drivers.forename,
    races."round",
    races.year,
    rank() over (order by points desc)
from "driverStandings"
inner join races on races."raceId" = "driverStandings"."raceId"
inner join (
    select year, max(round) as round from races group by year
    ) last_round on
        last_round."round" = races."round" and
        last_round.year = races.year
inner join drivers on drivers."driverId" = "driverStandings"."driverId"
where races.year = 2017
order by races.year desc, "driverStandings".points desc

If you want all years just partition by year and drop where

explain analyze

select
    "driverStandings".points,
    drivers.code,
    drivers.surname,
    drivers.forename,
    races."round",
    races.year,
    rank() over (partition by races.year order by points desc)
from "driverStandings"
inner join races on races."raceId" = "driverStandings"."raceId"
inner join (
    select year, max(round) as round from races group by year
    ) last_round on
        last_round."round" = races."round" and
        last_round.year = races.year
inner join drivers on drivers."driverId" = "driverStandings"."driverId"
order by races.year desc, "driverStandings".points desc

## With

explain analyze

with
    last_round_of_season as (
        select year, max(round) as round from races
        group by year
    )
select
    "driverStandings".points,
    drivers.code,
    drivers.surname,
    drivers.forename,
    races."round",
    races.year,
    rank() over (partition by races.year order by points desc)
from "driverStandings"
inner join races on races."raceId" = "driverStandings"."raceId"
inner join last_round_of_season on
    last_round_of_season."round" = races."round" and
    last_round_of_season.year = races.year
inner join drivers on drivers."driverId" = "driverStandings"."driverId"
where races.year = 2017
order by races.year desc, "driverStandings".points desc

with is not optimized as per final query, but the subselect was

explain analyze

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
from "driverStandings"
inner join races on races."raceId" = "driverStandings"."raceId"
inner join last_round_of_season on
    last_round_of_season."round" = races."round" and
    last_round_of_season.year = races.year
inner join drivers on drivers."driverId" = "driverStandings"."driverId"
cross join the_variables
where races.year = the_variables.year
order by races.year desc, "driverStandings".points desc

## Serve directly from DB

remove our the_variables and remove stuff from final_points
explain no where with rank

with
    last_round_of_season as (
        select races.year, max(round) as round from races
        group by races.year
    ),
    final_points as (
        select
            "driverStandings"."driverId",
            races."round",
            races.year,
            rank() over (partition by races.year order by points desc)
        from "driverStandings"
        inner join races on races."raceId" = "driverStandings"."raceId"
        inner join last_round_of_season on
            last_round_of_season."round" = races."round" and
            last_round_of_season.year = races.year
        order by races.year desc, "driverStandings".points desc
    ),
    champions as (
        select * from final_points
        inner join drivers on drivers."driverId" = final_points."driverId"
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

# Custom Aggregate
