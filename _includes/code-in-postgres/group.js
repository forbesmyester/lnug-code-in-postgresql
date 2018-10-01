let { runQuery, output } = require('./_utils');

function incrementWinCountForDriverId(winsByDriverId, row) {
    winsByDriverId[row.driverId] = (winsByDriverId[row.driverId] || 0) + 1;
    return winsByDriverId;
}

function keyValueToRow(keyFieldName, valueFieldName, kVPairs) {
    return Object.keys(kVPairs).map(k => {
        let r = {};
        r[keyFieldName] = parseInt(k, 10);
        r[valueFieldName] = kVPairs[k];
        return r;
    });
}

const qry = `
    select "driverId"
    from results
    where position = 1
    order by "driverId" ASC`;

runQuery(qry)
    .then(rows => {
        // as an object, increment wins for driver on the row.
        return rows.reduce(incrementWinCountForDriverId, {});
    })
    .then(obj => {
        // convert that object back into rows for consistency.
        return keyValueToRow('driverId', 'winCount', obj);
    })
    .then(output)
    .catch(err => { console.log("ERROR:", err) });

