const { runQuery } = require('./../_utils');

/**
 * Gets results from a table
 *
 * @param table string The of a table to pull from.
 * @param column The colum to look at to decide when to include a row.
 * @param values number[] Retreive values where `column` is one of these values.
 * @return Promise<Row[]>
 */
function qryTable(table, column=null, values) {
    if (column === null) {
        return runQuery(`select * from "${table}"`);
    }
    if (values.length == 0) { return []; }
    const inClause = '(' + values.map((_, i) => '$' + (i + 1)).join(",") + ')';
    const sql = `
        select *
        from "${table}"
        where "${column}" in ${inClause}`;

    return runQuery(sql, values);
}


module.exports = qryTable;
