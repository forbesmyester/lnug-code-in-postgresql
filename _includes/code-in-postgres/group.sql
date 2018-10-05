select
year, max(round) as round
from races
group by year
order by year
