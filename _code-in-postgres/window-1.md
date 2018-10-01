# Finding who won the last three races of the season

## If it were the first three races of the season...

If it were the first race of the season we could write the following driven by what we already know.

    select
        races.year,
        races.round,
        drivers.code, drivers.surname, drivers.forename
    from results
    inner join drivers on drivers."driverId" = results."driverId"
    inner join races on results."raceId" = races."raceId"
    where races.year >= 2000 and
        races.round in (1, 2, 3) and
        results.position  = 1

However seasons do not always have the same amount of races so it is impossible for us to write the `races.round = 1` using a static number.

Given that we know how to use `GROUP BY` and sub selects we might choose to write it like the following.

    select
        races.year,
        races.round,
        drivers.code, drivers.surname, drivers.forename
    from results
    inner join drivers on drivers."driverId" = results."driverId"
    inner join races on results."raceId" = races."raceId"
    inner join (
            select year, max(round) as round
            from races group by year
        ) max_round on
        races.round > max_round.round - 3 and
        races.year = max_round.year
    where races.year >= 2000 and results.position  = 1


