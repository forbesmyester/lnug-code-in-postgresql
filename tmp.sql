SELECT * from results limit 10

SELECT * from "lapTimes" limit 10

SELECT * from races limit 10

SELECT * from circuits limit 10

/* WITH Query for getting three years of results */
/* WITH Query for getting world champion */


select circuit, average_time from (
    select
        circuits.name as circuit,
        count(races.year) as race_count,
        avg(results.time::interval) as average_lap_time
    from results
    inner join races on races."raceId" = results."raceId"
    inner join circuits on circuits."circuitId" = races."circuitId"
    where
        races.year > 2014 and races.year < 2018 and
        results.position = 1
    group by circuits.name
) t
where race_count = 3
order by circuit asc


select
races.year,
nth_value(drivers.code, 1) over (partition by "races".year, races."raceId" order by results.position asc),
nth_value(drivers.code, 2) over (partition by "races".year, races."raceId" order by results.position asc),
nth_value(drivers.code, 3) over (partition by "races".year, races."raceId" order by results.position asc)
from results
inner join drivers on drivers."driverId" = results."driverId"
inner join races on results."raceId" = races."raceId"
group by races.year, drivers.code



select
    races.year,
    races.round,
    drivers.code, drivers.surname, drivers.forename,
    rank() over (partition by races.year order by races.round desc)
from results
inner join drivers on drivers."driverId" = results."driverId"
inner join races on results."raceId" = races."raceId"
where races.year >= 2000 and
    races.round = 1 and
    results.position  = 1


alter table results add constraint results_driverid_fkey foreign key ("driverId") references drivers("driverId")

create unique index on races ("raceId");

create index on races ("year");


select * from (
    select
    races.year,
    drivers.surname, drivers.forename,
    1 as position,
    count(*)
    from results
    inner join drivers on drivers."driverId" = results."driverId"
    inner join races on results."raceId" = races."raceId"
    where position = 1 and year = 2017
    group by "races".year, drivers."driverId"
    union select
    races.year,
    drivers.surname, drivers.forename,
    2 as position,
    count(*)
    from results
    inner join drivers on drivers."driverId" = results."driverId"
    inner join races on results."raceId" = races."raceId"
    where position = 2 and year = 2017
    group by "races".year, drivers."driverId"
) t
order by position asc, forename, surname
