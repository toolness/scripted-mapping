var fs = require('fs');
var csvrow = require('csvrow');
var stableStringify = require('json-stable-stringify');

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

function main() {
  var outfile = "data/nyc-school-addresses.json";
  fs.writeFileSync(__dirname + '/' + outfile,
                   stableStringify(module.exports, {space: 2}));
  console.log("wrote " + outfile + ".");
}

if (!module.parent)
  main();
