let { runQuery, output } = require('./_utils');


function prop(k) {
    return function(ob) {
        return ob.hasOwnProperty(k) ? ob[k] : null;
    }
}


function qryRacesIn2017() {
    return runQuery('select "raceId" from "races" where year = 2017')
        .then(r => r.map(prop('raceId')));
}


function qryPointsIn2017(raceIds) {
    const params = raceIds.map((_, i) => '$' + (i + 1)).join(', ');
    const qry = `
        select
            "driverStandings"."driverId",
            "driverStandings"."raceId",
            "driverStandings".points
        from "driverStandings"
        where "raceId" in (${params})
        order by "points" desc
        limit 1`

    return runQuery(qry, raceIds)
        .then(r => r.map(prop('driverId')));
}


function qryDriverInfo(driverId) {
    const qry = `
        select drivers.code, drivers.surname, drivers.forename
        from drivers
        where "driverId" = $1`
    return runQuery(qry, driverId);
}


qryRacesIn2017()
    .then(qryPointsIn2017)
    .then(qryDriverInfo)
    .then(output)
    .catch(err => {
        console.log("ERROR:", err)
    });
