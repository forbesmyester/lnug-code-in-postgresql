select
    races.round,
    races.name,
    circuits.country,
    circuits.location
from races
inner join circuits on
    circuits."circuitId" = races."circuitId"
where races.year = 2017
