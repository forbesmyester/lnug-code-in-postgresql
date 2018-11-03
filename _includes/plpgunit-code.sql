/**
 * As a person (identified by code) wins a championship in a year, we award them
 * bonus points for their first win but remove them over time.
 *
 * PostgreSQL allows the creation of [Custom Aggregates](https://www.postgresql.org/docs/9.5/static/sql-createaggregate.html)
 * which are very much like enhanced [`reduce`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)
 * functions.
 */

/**
 * Create a data type to store the value accumulated for ever line. If you can
 * represent your accumulator as an already existing type this is not required.
 */
create type fail_champ_champ_points_acc as (
    year_minus_2 varchar,
    year_minus_1 varchar,
    bonus_points int
);


/**
 * This function (called once per line) keeps track of the previous two winners
 * and has access to the current one, storing the amount of bonus_points in
 * `bonus_points`.
 *
 * This is pretty much exactly like the higher-order function you pass to the [`reduce`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)
 * function and like when you use reduce the accumulator you get out of it is
 * not necessarily the result you want because you may have to keep track of
 * extra elements for other rows.
 */
create function fail_champ_champ_points_sfunc(acc fail_champ_champ_points_acc, code varchar)
    returns fail_champ_champ_points_acc as
$$
    select
        acc.year_minus_1 as year_minus_2,
        code as year_minus_1,
        case
            when code = acc.year_minus_1 and 
                code = acc.year_minus_2
                then 0
            when code = acc.year_minus_1
                then 1
            else 3
        end as bonus_points
$$
language sql immutable;


/**
 * Takes the accumulator calculated from the previous function and convers it
 * to the actual result you want stored in the column.
 */
create function fail_champ_champ_points_finalfunc(acc fail_champ_champ_points_acc)
    returns int as
$$
    select acc.row_points;
$$
language sql immutable;


/**
 * Ties together the above code, telling PostgreSQL how to construct the
 * the aggregate
 */
create aggregate fail_champ_champ_points(code varchar) (
    sfunc = fail_champ_champ_points_sfunc,
    stype = fail_champ_champ_points_acc,
    initcond = '('''','''',0)',
    finalfunc = fail_champ_champ_points_finalfunc
);

