/**
 * Gets the first n rows from a set of rows.
 *
 * @param n number
 * @return (rows: Rows[]) => Rows[]
 */
function limit(n) {
    return function(rows) {
        if (rows.length < n) {
            throw new Error("limit(): Wanted to get ${n} rows, but less rows found");
        }
        return rows.slice(0, n);
    }
}


module.exports = limit;
