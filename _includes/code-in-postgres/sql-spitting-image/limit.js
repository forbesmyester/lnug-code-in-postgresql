/**
 * Gets the first n rows from a set of rows.
 *
 * @param n number
 * @return (rows: Rows[]) => Rows[]
 */
function limit(n) {
    return function(rows) {
        return rows.slice(0, n);
    }
}


module.exports = limit;
