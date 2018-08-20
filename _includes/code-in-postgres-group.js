let { runQuery, prepareOutput } = require('./code-in-postgres-utils');

const qry = `
    SELECT
        circuits.name as circuit,
        races.year,
        results.time::interval as lap_time
    FROM results
    INNER JOIN races ON races."raceId" = results."raceId"
    INNER JOIN circuits ON circuits."circuitId" = races."circuitId"
    WHERE
        races.year > 2014 AND races.year < 2018 AND
        results.position = 1
    ORDER BY circuits.name`;

runQuery(qry)
    .then(() => client.query(qry))
    .then((rows) => rows.forEach(outputter))
    .catch(err => { console.log("ERROR:", err) });

