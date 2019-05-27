let assert = require('assert');
let innerJoin = require('./innerJoin');

// No results when nothing matches
assert.deepEqual(
    innerJoin(
        'id',
        [{ id: "x", name: "Jack"}],
        "driverId",
        [{driverId: "y", race: "Silverstone 1981 GP"}]
    ),
    []
);

// Has Results
assert.deepEqual(
    innerJoin(
        'id',
        [{ id: "x", name: "Jack"}, { id: "y", name: "Sterling"}],
        'driverId',
        [
            {driverId: "y", race: "Silverstone 1981 GP"},
            {driverId: "y", race: "Spa GP 1982"}
        ]
    ),
    [
        {driverId: "y", race: "Silverstone 1981 GP", id: "y", name: "Sterling"},
        {driverId: "y", race: "Spa GP 1982", id: "y", name: "Sterling"}
    ]
);


