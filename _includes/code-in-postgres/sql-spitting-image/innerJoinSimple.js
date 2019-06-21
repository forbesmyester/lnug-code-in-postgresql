const { indexBySimple } = require('./_indexBySimple');

// interface LeftRow extends Row {
//     // Here there may be fields
// }
// interface RightRow extends Row {
//     // Here there may be fields
// }

/**
 * For every leftRow, combine it with as many as possible rightRow.
 *
 * @param leftRows LeftRow[]
 * @param joinColumns [keyof LeftRow, keyof RightRow] The fields to join
 * @param rightRows RightRow[]
 * @return Row[]
 */
function innerJoinSimple(leftRows, joinColumns, rightRows) {

    const [leftColumn, rightColumn] = joinColumns;

    /**
     * Join leftRow to all found foundRightRows
     *
     * @param leftRow LeftRow
     * @param foundRightRows RightRow[]
     */
    function joinRows(leftRow, foundRightRows) {
        return foundRightRows.map(rightRow => {
            return {...rightRow, ...leftRow};
        });
    }


    const rightRowIndex = indexBySimple(rightColumn, rightRows);

    let results = [];
    for (const leftRow of leftRows) {
        if (rightRowIndex.has(leftRow[leftColumn])) {
            results = results.concat(
                joinRows(
                    leftRow,
                    rightRowIndex.get(leftRow[leftColumn])
                )
            );
        }
    }

    return results;
}

module.exports = innerJoinSimple;
