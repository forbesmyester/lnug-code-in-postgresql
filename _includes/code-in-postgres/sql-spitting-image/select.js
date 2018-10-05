function select(spec) {

    function mapper(row) {
        let r = {};
        spec.forEach(([theFrom, theTo]) => {
            r[theTo] = row[theFrom]
        });
        return r;
    }

    return function selectImpl(rows) {
        return rows.map(mapper);
    };
}


module.exports = select;
