WITH "lastRaceIn2017" as (
    SELECT "raceId" FROM races
    WHERE year = 2017
    ORDER BY "round" DESC
    LIMIT 1
)
SELECT
    "driverStandings".points,
    "driverStandings"."driverId",
    drivers.forename,
    drivers.surname,
    2017 as year
FROM "driverStandings"
INNER JOIN drivers ON drivers."driverId" = "driverStandings"."driverId"
WHERE "raceId" IN ( SELECT "raceId" FROM "lastRaceIn2017" )
ORDER BY
    "driverStandings".points DESC,
    "driverStandings"."driverId" ASC
