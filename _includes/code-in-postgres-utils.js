const { Client } = require('pg');
const types = require('pg-types');
const DATE_OID = 1082;

types.setTypeParser(DATE_OID, (v) => {
    return v;
});

const client = new Client({ types });


function runQuery(qry) {

    let theRet;

    return client.connect()
        .then(() => client.query(qry))
        .then(({rows}) => { theRet = rows; })
        .then(() => client.end())
        .then(() => { return theRet; });

}

function prepareOutput(rows) {
    return rows.map(JSON.stringify).join("\n")
}

module.exports = { prepareOutput, runQuery };
