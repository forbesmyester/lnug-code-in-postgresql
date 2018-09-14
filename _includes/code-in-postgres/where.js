let { runQuery, output } = require('./_utils');

runQuery('SELECT * FROM drivers')
    .then((rows) => {
        // Keep only correct nationality
        return rows.filter(row => row.nationality == 'Colombian');
    })
    .then(rows => {
        // Sort by surname
        return rows.sort((a, b) => a.surname.localeCompare(b.surname));
    })
    .then(output)
    .catch(err => {
        console.log("ERROR:", err)
    });
