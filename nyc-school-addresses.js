var fs = require('fs');
var csvrow = require('csvrow');

var FILENAME = __dirname + "/data/nyc-school-addresses.csv";

module.exports = fs.readFileSync(FILENAME, "utf-8")
  .split('\n')
  .slice(1)                        // Remove the row w/ column names.
  .map(function(row) {
    var columns = csvrow.parse(row);
    return {
      name: columns[0],
      address: columns[1]
    };
  });

if (!module.parent)
  console.log(module.exports);
