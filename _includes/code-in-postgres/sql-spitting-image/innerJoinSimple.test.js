const assert = require("assert");
const innerJoinSimple = require('./innerJoinSimple');

const results = innerJoinSimple(
    [
        { id: 2, forename: "Lewis", surname: "Hamilton" },
        { id: 14, forename: "Fernando", surname: "Alonso" }
    ],
    [ 'id', 'winningDriverId' ],
    [ { circuit: 'Silverstone', winningDriverId: 14 } ]
)

assert.equal(results.length, 1);

