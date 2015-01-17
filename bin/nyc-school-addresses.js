var fs = require('fs');
var csv = require('csv');
var stableStringify = require('json-stable-stringify');

var ADDRESS_FIXUPS = {
  "1 CORPORATE COMMONS1 TELEPORT": "1 Teleport Drive, Staten Island, NY 10311",
  "250 EAST 156TH ST4TH FL": "250 East 156th Street, Bronx, NY 10451"
};
var PROGRAM_TYPES = [
  'ScriptEd',
  'Bootstrap',
  'SEP',
  'TEALS',
  'ECS',
  'ASE',
  'C/I',
  'AP CS A',
  'Charter'
];
var WEIRD_BOOLEANS = [
  'Close - 74%' // Bronx Academy of Letters has this under "ScriptEd"
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

function parseStudents(value) {
  var students = value.match(/^([0-9]+)([*]?)$/);

  if (!students) return null;
  if (students[2] == '*')
    return {allGrades: parseInt(students[1])};
  // Student numbers are only for grades 9-12.
  return parseInt(students[1]);
}

function getPrograms(columns, mapping) {
  return Object.keys(mapping).filter(function(name) {
    var index = mapping[name];
    if (columns[index].toUpperCase() == "YES") return true;
    if (columns[index] && WEIRD_BOOLEANS.indexOf(columns[index]) == -1)
      throw new Error("Unexpected boolean value: " + columns[index]);
  });
}

function getPercentage(value) {
  if (!value || value == '?' ||
      value == '"Most students"' /* lol whatevs, Cristo Rey */)
    return null;
  var percentage = value.match(/^([0-9.]+)%$/);
  if (!percentage)
    throw new Error('Unable to parse percentage: ' + value);
  percentage = parseFloat(percentage);
  if (isNaN(percentage))
    throw new Error('Unable to parse percentage: ' + value);
  return percentage;
}

function ellipsify(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

function main() {
  var data = fs.readFileSync(CSV_FILENAME, "utf-8");
  csv.parse(data, function(err, data) {
    if (err) throw err;

    var columnNames = data.splice(0, 1)[0];
    var programMapping = makeProgramMapping(columnNames);

    data = data.map(function(columns, i) {
      // In spreadsheet programs, row numbers start at 1, while i starts
      // at 0. We also need to account for the fact that row 1 is just the
      // column names, so the actual row number is i + 2.
      var rowNumber = i + 2;
      var column = function(name) {
        var index = columnNames.indexOf(name);
        if (index == -1)
          throw new Error("Invalid column name: " + name);
        return columns[index];
      };
      var name = column('School Name');
      var address = fixup(column('Address'), ADDRESS_FIXUPS);
      var students = column('Total Students 9th-12th [DOE 2013-14]');

      if (!name) {
        console.log("No school at row " + rowNumber + ", skipping it.");
        return null;
      }
      console.log("Processing school '" + ellipsify(name, 40) + "' (row " +
                  rowNumber + ")");

      if (address == '1150 EAST NEW YORK AVE' /* Brownsville Academy */
          || (!/NY/.test(address) && !/New York/i.test(address))) {
        address += ", " + column('City') + " NY " +
          column('Location ZIP [Public School] 2011-12');
        console.log("  Disambiguating", address);
      }
      return {
        name: name,
        address: address,
        programs: getPrograms(columns, programMapping),
        grades: [parseGrade(column('Lowest Grade Offered')),
                 parseGrade(column('Highest Grade Offered'))],
        students: parseStudents(students),
        freeLunch: getPercentage(column('Free Lunch % (Inside Schools)')),
        reducedLunch: getPercentage(column('Free & Reduced Lunch (NCES  2011-12/2012-13)')) ||
                      getPercentage(column('% eligible for free or reduced lunch (DOE 2013-14)'))
      };
    }).filter(function(info) { return !!info; });
    fs.writeFileSync(JSON_FILENAME, stableStringify(data, {space: 2}));
    console.log("Wrote " + BASENAME + ".json.");
  });
}

if (!module.parent)
  main();
