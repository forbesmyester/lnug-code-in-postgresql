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
