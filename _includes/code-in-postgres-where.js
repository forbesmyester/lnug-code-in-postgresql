let { runQuery, prepareOutput } = require('./code-in-postgres-utils');

runQuery('SELECT * FROM drivers')
    .then((rows) => rows.filter(row => row.nationality == 'Colombian'))
    .then(rows => rows.sort((a, b) => a.surname.localeCompare(b.surname)) )
    .then(prepareOutput)
    .then(console.log)
    .catch(err => {
        console.log("ERROR:", err)
    });
