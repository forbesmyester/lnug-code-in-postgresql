function getSingleCompareFunction(columnName, direction) {
    return function singleCompareFunction(rowA, rowB) {
        flipper = direction.toLowerCase() == 'asc' ? 1 : -1;
        return (rowA[columnName] - rowB[columnName]) * flipper;
    }
}


/**
 * Orders a set of rows
 *
 * @param colDirectionTuples [c: string, d: string][] Ordering specification where `c` is line `columnName` and `d` is like `direction` from `orderBy`
 * @param rows Row[]
 * @return Row[]
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

/**
 * Orders a set of rows
 *
 * @param columnName string
 * @param direction string ( 'ASC' || 'DESC' )
 * @param rows Row[]
 * @return Row[]
 */
function orderBy(columnName, direction='ASC') {

    if (columnName instanceof Array) { return orderByMulti(columnName); }

    let compareFunction = getSingleCompareFunction(columnName, direction);

    return function(rows) {
        return rows.sort(compareFunction);
    };
}


module.exports = orderBy;
