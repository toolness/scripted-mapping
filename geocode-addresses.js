var fs = require('fs');
var async = require('async');
var stableStringify = require('json-stable-stringify');
var request = require('request');
var schoolInfo = require('./nyc-school-addresses');

var FILENAME = __dirname + "/data/geocode-addresses.json";
var GEO_COMPONENT_FILTERS = [
  'country:US'
].join('|');

var geocodes = JSON.parse(fs.readFileSync(FILENAME, "utf-8"));

function geocode(apiKey, address, cb) {
  if (address in geocodes)
    return process.nextTick(cb.bind(null, null, geocodes[address]));

  // https://developers.google.com/maps/documentation/geocoding/
  request({
    url: 'https://maps.googleapis.com/maps/api/geocode/json',
    qs: {
      key: apiKey,
      address: address,
      sensor: 'false',
      components: GEO_COMPONENT_FILTERS
    }
  }, function(err, geoRes, body) {
    if (err) return cb(err);
    if (geoRes.statusCode != 200)
      return cb(new Error('got http ' + geoRes.statusCode));
    body = JSON.parse(body);
    if (body.status != 'OK') return cb(new Error(body.status));
    var result = body.results[0];
    var location = result.geometry.location;
    location.formatted_address = result.formatted_address;
    geocodes[address] = location;
    fs.writeFileSync(FILENAME, stableStringify(geocodes, {space: 2}));
    cb(null, geocodes[address]);
  });
}

function main() {
  var GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

  if (!GOOGLE_API_KEY) {
    console.log("GOOGLE_API_KEY is not defined in environment, aborting.");
    process.exit(1);
  }

  async.eachLimit(schoolInfo, 3, function(info, cb) {
    console.log("Geocoding " + info.name + "...");
    geocode(GOOGLE_API_KEY, info.address, function(err) {
      if (!err) return cb(null);
      if (/OVER_QUERY_LIMIT/.test(err.toString()))
        return setTimeout(function() {
          console.log("Over query limit, retrying in 5s.");
          geocode(GOOGLE_API_KEY, info.address, cb);
        }, 5000);
      cb(err);
    });
  }, function(err) {
    if (err) throw err;
    console.log("Done.");
  });
}

exports.geocodes = geocodes;

if (!module.parent)
  main();
