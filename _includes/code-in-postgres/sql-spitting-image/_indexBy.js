/**
 * TODO: Docs
 */
function generateIndexByKey(columnNames, row) {
    if (columnNames instanceof Array) {
        return JSON.stringify(
            columnNames.map(cn => row[cn])
        );
    }
    return row[columnNames];
}


/**
 * Given an array or Row, looks at the data and indexes them by a specific
 * columnNames so you can find a Row quickly without having to `.find()` it.
 *
 * @param columnNames string[]|string
 * @param results Row[]
 * @return {[columnName: string]: Row[]}
 */
function indexBy(columnNames, results) {
    return results.reduce((acc, row) => {
        let k = generateIndexByKey(columnNames, row);
        if (!acc.has(k)) {
            acc.set(k, []);
        }
        acc.get(k).push(row);
        return acc;
    }, new Map());
}


module.exports = { indexBy, generateIndexByKey };
