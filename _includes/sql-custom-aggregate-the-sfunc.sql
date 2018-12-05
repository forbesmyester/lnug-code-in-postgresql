create function race_time_sfunc(acc bigint[], comp_count smallint, fin_time bigint)
    returns bigint[] as
$$
    with t (f) as (
        select unnest(array_append(acc, fin_time))
        order by 1 asc
        limit comp_count
    )
    select array_agg(f) from t
$$
language sql immutable;
