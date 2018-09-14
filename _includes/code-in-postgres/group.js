let { runQuery, output } = require('./_utils');

const qry = `
    select "driverId"
    from results
    where position = 1
    order by "driverId" ASC`;

runQuery(qry)
    .then(rows => {
        // as an object, increment wins for driver on the row.
        return rows.reduce((acc, row) => {
            acc[row.driverId] = (acc[row.driverId] || 0) + 1;
            return acc;
        }, {})
    })
    .then(obj => {
        // convert that object back into rows for consistency.
        return Object.keys(obj).map(k => {
            return { driverId: parseInt(k, 10), winCount: obj[k] };
        });
    })
    .then(output)
    .catch(err => { console.log("ERROR:", err) });

