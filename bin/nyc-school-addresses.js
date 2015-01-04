var fs = require('fs');
var csv = require('csv');
var stableStringify = require('json-stable-stringify');

var ADDRESS_FIXUPS = {
  "1 CORPORATE COMMONS1 TELEPORT": "1 Teleport Drive, Staten Island, NY 10311",
  "250 EAST 156TH ST4TH FL": "250 East 156th Street, Bronx, NY 10451"
};
var PROGRAM_TYPES = [
  'ScriptEd',
  'CTE',
  'MOUSE',
  'Bootstrap',
  'SGD',
  'SEP',
  'TEALS',
  'ECS',
  'ASE',
  'C/I',
  'AP CS A',
  'Club',
  'Charter'
];
var BASENAME = "data/nyc-school-addresses";
var CSV_FILENAME = __dirname + "/../" + BASENAME + ".csv";
var JSON_FILENAME = __dirname + "/../" + BASENAME + ".json";

module.exports = JSON.parse(fs.readFileSync(JSON_FILENAME, "utf-8"));

function fixup(value, fixups) {
  if (value in fixups) return fixups[value];
  return value;
}

function makeProgramMapping(columnNames) {
  var mapping = {};

  PROGRAM_TYPES.forEach(function(name) {
    var index = columnNames.indexOf(name);
    if (index == -1)
      throw new Error("Column not found: " + name);
    mapping[name] = index;
  });

  return mapping;
}

function parseGrade(text) {
  if (/^kindergarten$/i.test(text)) return 0;
  if (text == "N/A" || !text.trim()) return null;

  var match = text.match(/^([0-9]+)th/);
  if (!match)
    throw new Error("Cannot parse grade: " + text);
  return parseInt(match[1]);
}

function getPrograms(columns, mapping) {
  return Object.keys(mapping).filter(function(name) {
    var index = mapping[name];
    if (columns[index] == "YES") return true;
    if (columns[index])
      throw new Error("Unexpected boolean value: " + columns[index]);
  });
}

function getPercentage(value) {
  if (!value || value == '?') return null;
  var percentage = value.match(/^([0-9.]+)%$/);
  if (!percentage)
    throw new Error('Unable to parse percentage: ' + value);
  percentage = parseFloat(percentage);
  if (isNaN(percentage))
    throw new Error('Unable to parse percentage: ' + value);
  return percentage;
}

function main() {
  var data = fs.readFileSync(CSV_FILENAME, "utf-8");
  csv.parse(data, function(err, data) {
    if (err) throw err;

    var columnNames = data.splice(0, 1)[0];
    var programMapping = makeProgramMapping(columnNames);

    data = data.map(function(columns) {
      var column = function(name) {
        var index = columnNames.indexOf(name);
        if (index == -1)
          throw new Error("Invalid column name: " + name);
        return columns[index];
      };
      var address = fixup(column('Address'), ADDRESS_FIXUPS);
      var students = column('Total Students [Public School] 2011-12');

      students = parseInt(students);
      if (isNaN(students)) students = null;
      if (!/NY/.test(address) && !/New York/i.test(address)) {
        address += ", " + column('Borough') + " NY " +
          column('Location ZIP [Public School] 2011-12');
        console.log("Disambiguating", address);
      }
      return {
        name: column('School Name'),
        address: address,
        programs: getPrograms(columns, programMapping),
        grades: [parseGrade(column('Lowest Grade Offered')),
                 parseGrade(column('Highest Grade Offered'))],
        students: students,
        freeLunch: getPercentage(column('% of Students Eligible for Free Lunch Program (2011-12 and 2014-15)')),
        reducedLunch: getPercentage(column('% of Student Eligible for a Free or Reduced-Fee Lunch'))
      };
    });
    fs.writeFileSync(JSON_FILENAME, stableStringify(data, {space: 2}));
    console.log("wrote " + BASENAME + ".json.");
  });
}

if (!module.parent)
  main();
