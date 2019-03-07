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


/**
 * Adds a value to an Object.
 *
 * @param k string Where the value will be stored.
 * @param v any The value.
 * @param ob The Object to add the value to.
 * @return A shallow copy of `ob` with `v` added at `k`.
 */
function assoc(k, v, ob) {
    let m = {};
    m[k] = v;
    return Object.assign({}, ob, m);
}

/**
 * Takes an Array of Array and converts it into just an Array by removing one
 * level of nesting.
 *
 * @param Array<Array<T>>
 * @return Array<T>
 */
function flatten(rowOfRows) {
    return rowOfRows.reduce((acc, rows) => acc.concat(rows), []);
}


module.exports = { assoc, flatten, output, runQuery };
