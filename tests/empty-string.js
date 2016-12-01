const assert = require("assert");

const parseCSV = require("../csv-parser");

process.chdir(__dirname);

parseCSV(
    "empty-string.csv",
    data => {
        assert.equal(data.length, 3);
        assert.equal(data[0][0].length, 0);
        assert.deepEqual(data[1], ["", "", "", ""]);
        console.log("Empty string: passed");
    }
);
