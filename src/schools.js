define(function(require) {
  var _ = require('underscore');
  var geocodes = JSON.parse(require('text!data/geocode-addresses.json'));
  var schools = JSON.parse(require('text!data/nyc-school-addresses.json'));
  var origins = JSON.parse(require('text!data/origin-points.json'));
  var trips = JSON.parse(require('text!data/transit-times.json'));

  var MARKER_COLOR = '#f0a';

  var originIndexesBySlug = {};
  var geoJson = null;

  // Cached mapping from search queries to subsets of the geoJson array.
  // This shouldn't use a ton of memory since each entry is just a list
  // of pointers, but in the worst case we can always turn it into a
  // LRU cache or something.
  var filteredGeoJson = {};

  function toGeoJson() {
    if (geoJson) return geoJson;

    var ids = {};
    geoJson = [];
    schools.forEach(function(school) {
      var geocode = geocodes[school.address];
      var id = geocode.lng + ',' + geocode.lat;
      var tripInfo = origins.map(function(origin) {
        var trip = trips[origin.address][school.address];
        if (!trip)
          throw new Error("No trip data for " + school.address);
        return {
          origin: origin,
          duration: trip.duration
        };
      });

      if (!ids[id]) {
        ids[id] = {
          type: 'Feature',
          id: id,
          geometry: {
            type: 'Point',
            coordinates: [geocode.lng, geocode.lat]
          },
          properties: {
            'trips': tripInfo,
            'schools': [],
            'marker-size': 'small',
            'marker-color': MARKER_COLOR
          }
        };
        geoJson.push(ids[id]);
      }
      ids[id].properties.schools.push(_.extend({}, school, {
        address: geocode.formatted_address.match(/^(.+), USA$/)[1]
      }));
    });

    return geoJson;
  }

  function parseQuery(query) {
    var match = query.match(/^(.*?)([0-9]+)m\s+from\s+([A-Za-z0-9]+)$/);
    if (!match) return {str: query};

    var str = match[1].trim();
    var time = parseInt(match[2]);
    var origin = match[3];

    if (!(origin in originIndexesBySlug))
      return {str: str};

    return {
      str: str,
      time: time,
      origin: origin
    };
  }

  function filterGeoJson(query) {
    var geoJson = toGeoJson();
    query = parseQuery(query.trim().toLowerCase());
    var queryKey = JSON.stringify(query);
    if (!filteredGeoJson[queryKey]) {
      var results = geoJson;
      if (query.str)
        results = results.filter(function(item) {
          return item.properties.schools.some(function(school) {
            var inName = school.name.toLowerCase().indexOf(query.str) != -1;
            var inPrograms = school.programs.some(function(program) {
              return program.toLowerCase().indexOf(query.str) != -1;
            });
            return inName || inPrograms;
          });
        });
      if (query.origin && query.time)
        results = results.filter(function(item) {
          var origin = originIndexesBySlug[query.origin];
          var trip = item.properties.trips[origin];

          return trip.duration / 60 <= query.time;
        });

      filteredGeoJson[queryKey] = results;
    }
    return filteredGeoJson[queryKey];
  }

  origins.forEach(function(origin, i) {
    originIndexesBySlug[origin.slug] = i;
  });

  return {
    toGeoJson: toGeoJson,
    filterGeoJson: filterGeoJson
  };
});
