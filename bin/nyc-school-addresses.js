var fs = require('fs');
var csv = require('csv');
var stableStringify = require('json-stable-stringify');

var ADDRESS_FIXUPS = {
  "1 CORPORATE COMMONS1 TELEPORT": "1 Teleport Drive, Staten Island, NY 10311",
  "250 EAST 156TH ST4TH FL": "250 East 156th Street, Bronx, NY 10451"
};
var BASENAME = "data/nyc-school-addresses";
var CSV_FILENAME = __dirname + "/../" + BASENAME + ".csv";
var JSON_FILENAME = __dirname + "/../" + BASENAME + ".json";

module.exports = JSON.parse(fs.readFileSync(JSON_FILENAME, "utf-8"));

function fixup(value, fixups) {
  if (value in fixups) return fixups[value];
  return value;
}

function main() {
  var data = fs.readFileSync(CSV_FILENAME, "utf-8");
  csv.parse(data, function(err, data) {
    if (err) throw err;

  // Remove the row w/ column names.
    data.splice(0, 1);

    data = data.map(function(columns) {
      return {
        name: columns[1],
        address: fixup(columns[18], ADDRESS_FIXUPS)
      };
    });
    fs.writeFileSync(JSON_FILENAME, stableStringify(data, {space: 2}));
    console.log("wrote " + BASENAME + ".json.");
  });
}

if (!module.parent)
  main();
