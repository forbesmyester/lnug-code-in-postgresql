drop function if exists unit_tests.champ_champ_points_sfunc_test();
drop function if exists unit_tests.champ_champ_points_finalfunc_test;

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



