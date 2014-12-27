var fs = require('fs');
var async = require('async');
var stableStringify = require('json-stable-stringify');
var request = require('request');
var originPointInfo = require('./data/origin-points.json');
var schoolInfo = require('./nyc-school-addresses');

var FILENAME = __dirname + "/data/transit-times.json";
var DEPARTURE_TIME = 1343641500;  // July 30, 2012 at 09:45 am

var trips = JSON.parse(fs.readFileSync(FILENAME, "utf-8"));

function getTransitTime(apiKey, origin, destination, cb) {
  if (trips[origin] && trips[origin][destination])
    return process.nextTick(function() {
      cb(null,  trips[origin][destination]);
    });

  // https://developers.google.com/maps/documentation/directions/
  request({
    url: 'https://maps.googleapis.com/maps/api/directions/json',
    qs: {
      key: apiKey,
      departure_time: DEPARTURE_TIME,
      origin: origin,
      destination: destination,
      mode: 'transit'
    }
  }, function(err, transitRes, body) {
    if (err) return cb(err);
    if (transitRes.statusCode != 200)
      return cb(new Error('got http ' + transitRes.statusCode));
    body = JSON.parse(body);
    if (body.status != 'OK') return cb(new Error(body.status));
    var leg = body.routes[0].legs[0];
    var trip = {
      distance: leg.distance.value,         // in meters
      duration: leg.duration.value          // in seconds
    };
    if (!trips[origin]) trips[origin] = {};
    trips[origin][destination] = trip;
    fs.writeFileSync(FILENAME, stableStringify(trips, {space: 2}));
    cb(null, trips[origin][destination]);
  });
}

function main() {
  var GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

  if (!GOOGLE_API_KEY) {
    console.log("GOOGLE_API_KEY is not defined in environment, aborting.");
    process.exit(1);
  }

  var allTrips = [];

  originPointInfo.forEach(function(originInfo) {
    schoolInfo.forEach(function(destinationInfo) {
      allTrips.push({
        origin: originInfo,
        destination: destinationInfo
      });
    });
  });

  async.eachLimit(allTrips, 2, function(info, cb) {
    var get = getTransitTime.bind(null, GOOGLE_API_KEY, info.origin.address,
                                  info.destination.address);
    console.log("Calculating " +
                info.origin.name + " -> " + info.destination.name + "...");
    get(function(err) {
      if (!err) return cb(null);
      if (/OVER_QUERY_LIMIT/.test(err.toString()))
        return setTimeout(function() {
          console.log("Over query limit, retrying in 5s.");
          get(cb);
        }, 5000);
      cb(err);
    });
  }, function(err) {
    if (err) throw err;
    console.log("Done.");
  });
/*
  getTransitTime(GOOGLE_API_KEY,
                 "343 Gold St., Brooklyn NY",
                 "1 MetroTech Center, Brooklyn NY",
                 function(err, info) {
                  if (err) throw err;
                  console.log(info);
                 });*/
}

if (!module.parent)
  main();
