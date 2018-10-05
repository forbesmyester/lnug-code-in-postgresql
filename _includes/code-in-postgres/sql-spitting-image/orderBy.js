
/**
 * Orders a set of rows using a orderBy function
 *
 * @param columnName string
 * @param direction string ( 'ASC' || 'DESC' )
 * @param rows Row[]
 * @return Row[]
 */
function orderBy(columnName, direction='ASC') {
    function compareFunction(rowA, rowB) {
        flipper = direction.toLowerCase() == 'asc' ? 1 : -1;
        return (rowA[columnName] - rowB[columnName]) * flipper;
    }

    return function(rows) {
        return rows.sort(compareFunction);
    };
}


module.exports = orderBy;
