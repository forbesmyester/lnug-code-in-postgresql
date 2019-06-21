SELECT
    "driverStandings".points,
    "driverStandings"."driverId",
    2017 as year
FROM "driverStandings"
WHERE "raceId" IN (
    SELECT "raceId" FROM races
    WHERE year = 2017
    ORDER BY "round" DESC
    LIMIT 1
)
ORDER BY
    "driverStandings".points DESC,
    "driverStandings"."driverId" ASC
