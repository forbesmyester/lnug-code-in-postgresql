let { runQuery, output } = require('./_utils');
const groupBy = require('./sql-spitting-image/groupBy');
const orderBy = require('./sql-spitting-image/orderBy');


const qry = `
    select
    year, "round"
    from races`;


runQuery(qry)
    .then(groupBy(['year'], [{ fun: 'max', col: 'round', out: 'round' }]))
    .then(orderBy('year'))
    .then(output)
    .catch(err => { console.log("ERROR:", err) });
