var fs = require('fs');
var csv = require('csv');
var stableStringify = require('json-stable-stringify');

var BASENAME = "data/nyc-school-addresses";
var CSV_FILENAME = __dirname + "/../" + BASENAME + ".csv";
var JSON_FILENAME = __dirname + "/../" + BASENAME + ".json";

module.exports = JSON.parse(fs.readFileSync(JSON_FILENAME, "utf-8"));

function main() {
  var data = fs.readFileSync(CSV_FILENAME, "utf-8");
  csv.parse(data, function(err, data) {
    if (err) throw err;

  // Remove the row w/ column names.
    data.splice(0, 1);

    data = data.map(function(columns) {
      return {
        name: columns[0],
        address: columns[1]
      };
    });
    fs.writeFileSync(JSON_FILENAME, stableStringify(data, {space: 2}));
    console.log("wrote " + BASENAME + ".json.");
  });
}

if (!module.parent)
  main();
