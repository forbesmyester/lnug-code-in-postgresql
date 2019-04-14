WITH "racesIn2017" as (
    SELECT "raceId" FROM races WHERE year = 2017
)
SELECT
    "driverStandings".points,
    "driverStandings"."driverId",
    2017 as year
FROM "driverStandings"
WHERE "raceId" IN ( SELECT "raceId" FROM "racesIn2017" )
ORDER BY "driverStandings".points DESC
LIMIT 1
