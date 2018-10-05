const { Client } = require('pg');
const types = require('pg-types');
const DATE_OID = 1082;


/**
 * interface Row { [ columnName: string ]: any; }
 */


types.setTypeParser(DATE_OID, (v) => {
    return v;
});


function runQuery(qry, values) {

    let theRet;

    const client = new Client({ types });

    return client.connect()
        .then(() => client.query(qry, values))
        .then(({rows}) => { theRet = rows; })
        .then(() => client.end())
        .then(() => { return theRet; });

}

function sortObKeys(ob) {
    const keys = Object.keys(ob).sort();
    return keys.reduce((acc, k) => {
        acc[k] = ob[k];
        return acc;
    }, {});
}

function output(rows) {
    let r = rows
        .map(sortObKeys)
        .map(JSON.stringify)
        .join("\n");
    console.log(r);
    return r;
}


module.exports = { output, runQuery };
