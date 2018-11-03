create function unit_tests.fail_champ_champ_points_sfunc_test()
returns test_result as
$$
DECLARE message test_result;
declare result boolean;
BEGIN

    /* If not won last, give 3 bonus points and add as previous winner. */
    select * from assert.is_equal(
        (fail_champ_champ_points_sfunc(('b', 'b', 0)::fail_champ_champ_points_acc, 'c')),
        ('b', 'c', 3)::fail_champ_champ_points_acc
    ) into message, result;
    if result = false then return message; end if;

    /* If won last but not last-1, give 1 bonus points and add to the end
     * pushing the last to the last-1
     */
    select * from assert.is_equal(
        fail_champ_champ_points_sfunc(('b', 'c', 3)::fail_champ_champ_points_acc, 'c'),
        ('c', 'c', 1)::fail_champ_champ_points_acc
    ) into message, result;
    if result = false then return message; end if;

    /* If won both previous, then you will get no bonus points */
    select * from assert.is_equal(
        (fail_champ_champ_points_sfunc(('c', 'c', 1)::fail_champ_champ_points_acc, 'c')),
        ('c', 'c', 0)::fail_champ_champ_points_acc
    ) into message, result;
    if result = false then return message; end if;

    /* If not failed, we need to mark the result as successful. */
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

    /* Only extracts bonus_points from the accumulator. */
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


SELECT * FROM unit_tests.begin(); /* Run the tests */
