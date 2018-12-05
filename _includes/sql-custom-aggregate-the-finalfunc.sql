create function race_time_finalfunc(acc bigint[])
    returns numeric as
$$
    with t (f) as (select unnest(acc))
    select avg(f) from t
$$
language sql immutable;

