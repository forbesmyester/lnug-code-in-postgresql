create aggregate race_time(comp_count smallint, fin_time bigint) (
    stype = bigint[],
    initcond = '{}',
    sfunc = race_time_sfunc,
    finalfunc = race_time_finalfunc
);
