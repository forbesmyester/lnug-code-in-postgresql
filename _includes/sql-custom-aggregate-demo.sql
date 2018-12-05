create temporary table test_table (val int);
insert into test_table(val) values (2), (3), (5), (3), (4), (1);
select race_time(3::smallint, val) from test_table

