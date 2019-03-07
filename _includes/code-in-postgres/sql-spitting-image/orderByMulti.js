const { getSingleCompareFunction } = require('./orderBy');

/**
 * Gets a `sortFn` for [Array.prototype.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
 * that will sort whole rows based on a list of `columnName` and `direction`
 * tuples.
 *
 * @param colDirectionTuples `[columnName: string, direction: string][]`
 * Ordering specification where `columnName` and `direction` are parameters from
 * `getSingleCompareFunction`.
 * @return (a: Row, b: Row) => number The `sortFn`.
 */
function orderByMulti(colDirectionTuples) {

    function compareFunction(rowA, rowB) {
        return colDirectionTuples.reduce((acc, [col, dir]) => {
            if (acc != 0) { return acc; }
            const cf = getSingleCompareFunction(col, dir);
            return cf(rowA, rowB);
        }, 0);
    }

    return function(rows) {
        return rows.sort(compareFunction);
    }

}

module.exports = orderByMulti;
