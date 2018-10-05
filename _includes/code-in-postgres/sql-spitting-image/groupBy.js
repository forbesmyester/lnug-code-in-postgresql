const indexBy = require('./_indexBy');
let assert = require('assert');


const funcs = {
    max: (acc, item) => {
        if (acc === undefined) { return item; }
        return item > acc ? item : acc
    }
}


function prop(k) {
    return function(ob) {
        return ob.hasOwnProperty(k) ? ob[k] : null;
    }
}


function processGroup(aggregations, rows) {
    return aggregations.reduce(
        (acc, agg) => {
            acc[agg.out] = rows.map(prop(agg.col)).reduce(funcs[agg.fun]);
            return acc;
        },
        {}
    );
}


assert.deepEqual(
    {rnd: 8},
    processGroup(
        [{ col: 'round', fun: 'max', out: 'rnd' }],
        [
            { year: 2017, month: 2, round: 4, name: "San Marino GP" },
            { year: 2017, month: 3, round: 8, name: "Monaco GP" },
            { year: 2017, month: 3, round: 6, name: "British GP" },
        ]
    )
);


function getGroupValues(cols, gRows) {
    return cols.reduce((acc, col) => {
        acc[col] = gRows[0][col];
        return acc;
    }, {});
}


function groupBy(cols, aggregations) {
    return function(rows) {
        const indexed = indexBy(cols, rows);
        const indexKeys = Object.keys(indexed);
        return indexKeys.map((ik) => {
            return Object.assign(
                {},
                processGroup(aggregations, indexed[ik]),
                getGroupValues(cols, indexed[ik])
            );
        });
    }
}


const races = [
    { year: 2017, month: 2, round: 4, name: "San Marino GP" },
    { year: 2017, month: 3, round: 8, name: "Monaco GP" },
    { year: 2017, month: 3, round: 6, name: "British GP" },
    { year: 2018, month: 3, round: 2, name: "Australian GP" },
    { year: 2001, month: 3, round: 1, name: "French" },
    { year: 2001, month: 3, round: 2, name: "Spanish" }
];


assert.deepEqual(
    groupBy(['year', 'month'], [{ col: 'round', fun: 'max', out: 'rnd' }])(races),
    [
        { year: 2017, month: 2, rnd: 4 },
        { year: 2017, month: 3, rnd: 8 },
        { year: 2018, month: 3, rnd: 2 },
        { year: 2001, month: 3, rnd: 2 }
    ]
);

module.exports = groupBy;
