select "driverId", count(*) as "winCount"
from results
where position = 1
group by "driverId"
order by "driverId" ASC
