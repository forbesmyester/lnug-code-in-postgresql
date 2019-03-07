/**
 * Creates a `sortFn` for the JavaScript [Array.prototype.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) function.
 *
 * @param columnName string The name of the column to sort by.
 * @param direction string If this is 'ASC' sort ascending, otherwise descending.
 * @return (a: number, b: number) => number The `sortFn`.
 */
function getSingleCompareFunction(columnName, direction) {

    const flipper = direction.toLowerCase() == 'asc' ? 1 : -1;

    return function singleCompareFunction(rowA, rowB) {
        return (rowA[columnName] - rowB[columnName]) * flipper;
    }
}


/**
 * Orders a set of rows
 *
 * @param columnName string
 * @param direction string ( 'ASC' || 'DESC' )
 * @param rows Row[]
 * @return Row[]
 */
function orderBy(columnName, direction='ASC') {

    const compareFunction = getSingleCompareFunction(columnName, direction);

    return function(rows) {
        return rows.sort(compareFunction);
    };
}


orderBy.getSingleCompareFunction = getSingleCompareFunction;
module.exports = orderBy;
