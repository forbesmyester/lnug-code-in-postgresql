drop aggregate if exists fail_champ_champ_points(code varchar);
drop function if exists fail_champ_champ_points_finalfunc(acc fail_champ_champ_points_acc);
drop function if exists fail_champ_champ_points_sfunc(acc fail_champ_champ_points_acc, code varchar);
drop function if exists unit_tests.fail_champ_champ_points_sfunc_test();
drop function if exists unit_tests.fail_champ_champ_points_finalfunc_test;
drop type if exists fail_champ_champ_points_acc;


create type fail_champ_champ_points_acc as (year_minus_2 varchar, year_minus_1 varchar, row_points int);


create function fail_champ_champ_points_sfunc(acc fail_champ_champ_points_acc, code varchar)
    returns fail_champ_champ_points_acc as
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


create function unit_tests.fail_champ_champ_points_sfunc_test()
returns test_result as
$$
DECLARE message test_result;
declare result boolean;
BEGIN
    select * from assert.is_equal(
        (fail_champ_champ_points_sfunc(('b', 'b', 0)::fail_champ_champ_points_acc, 'c')),
        ('b', 'c', 3)::fail_champ_champ_points_acc
    ) into message, result;
    if result = false then return message; end if;
    select * from assert.is_equal(
        fail_champ_champ_points_sfunc(('b', 'c', 3)::fail_champ_champ_points_acc, 'c'),
        ('c', 'c', 1)::fail_champ_champ_points_acc
    ) into message, result;
    if result = false then return message; end if;
    select * from assert.is_equal(
        (fail_champ_champ_points_sfunc(('c', 'c', 1)::fail_champ_champ_points_acc, 'c')),
        ('c', 'c', 0)::fail_champ_champ_points_acc
    ) into message, result;
    if result = false then return message; end if;
    SELECT assert.ok('End of test.') INTO message;	
    return message;
END
$$
language plpgsql;


create function fail_champ_champ_points_finalfunc(acc fail_champ_champ_points_acc)
    returns int as
$$
    select acc.row_points;
$$
language sql immutable;


create function unit_tests.fail_champ_champ_points_finalfunc_test()
returns test_result as
$$
DECLARE message test_result;
declare result boolean;
BEGIN
    select * from assert.is_equal(
        fail_champ_champ_points_finalfunc(('b', 'b', 7)::fail_champ_champ_points_acc),
        7::int
    ) into message, result;
    if result = false then return message; end if;
    SELECT assert.ok('End of test.') INTO message;	
    return message;
END
$$
language plpgsql;


SELECT * FROM unit_tests.begin();


create aggregate fail_champ_champ_points(code varchar) (
    sfunc = fail_champ_champ_points_sfunc,
    stype = fail_champ_champ_points_acc,
    initcond = '('''','''',0)',
    finalfunc = fail_champ_champ_points_finalfunc
);




with
    the_variables (min_year) as ( values (1985) ),
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
        order by surname
    )
select
    surname, forename, code, year,
    fail_champ_champ_points(code) over (order by year)
from champions
order by year asc

/*
 points | code | surname  | forename  | round | year | rank 
--------+------+----------+-----------+-------+------+------
    363 | HAM  | Hamilton | Lewis     |    20 | 2017 |    1
    384 | HAM  | Hamilton | Lewis     |    19 | 2014 |    1
    381 | HAM  | Hamilton | Lewis     |    19 | 2015 |    1
    385 | ROS  | Rosberg  | Nico      |    21 | 2016 |    1
    397 | VET  | Vettel   | Sebastian |    19 | 2013 |    1
    256 | VET  | Vettel   | Sebastian |    19 | 2010 |    1
    392 | VET  | Vettel   | Sebastian |    19 | 2011 |    1
    281 | VET  | Vettel   | Sebastian |    20 | 2012 |    1
    (8 rows)

*/

