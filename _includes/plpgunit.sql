create or replace function unit_tests.race_time_sfunc_test()
    returns test_result as
$$
DECLARE message test_result;
DECLARE result boolean;
BEGIN
    select * from assert.is_equal(
        race_time_sfunc('{1}'::bigint[], 3::smallint, 2::bigint),
        '{1,2}'::bigint[]
    ) into message, result;
    if result = false then return message; end if;
    select * from assert.is_equal(
        race_time_sfunc('{1,1,3}'::bigint[], 3::smallint, 2::bigint),
        '{1,1,2}'::bigint[]
    ) into message, result;
    if result = false then return message; end if;
    select * from assert.is_equal(
        race_time_sfunc('{2,3,4}'::bigint[], 3::smallint, 5::bigint),
        '{2,3,4}'::bigint[]
    ) into message, result;
    if result = false then return message; end if;
    SELECT assert.ok('End of test.') INTO message;	
    return message;
END
$$
LANGUAGE plpgsql;


create or replace function unit_tests.race_time_test()
    returns test_result as
$$
DECLARE message test_result;
DECLARE result boolean;
BEGIN
    create temporary table test_table (val int);
    insert into test_table(val) values (2), (3), (5), (3), (4), (1);
    select * from assert.is_equal(
        (select race_time(3::smallint, val) from test_table),
        2::numeric
    ) into message, result;
    drop table test_table;
    if result = false then return message; end if;
    SELECT assert.ok('End of test.') INTO message;	
    return message;
END
$$
LANGUAGE plpgsql;

begin;
SELECT * FROM unit_tests.begin(); /* Run the tests */
rollback;
