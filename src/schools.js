define(function(require) {
  var _ = require('underscore');
  var geocodes = JSON.parse(require('text!data/geocode-addresses.json'));
  var schools = JSON.parse(require('text!data/nyc-school-addresses.json'));
  var origins = JSON.parse(require('text!data/origin-points.json'));
  var trips = JSON.parse(require('text!data/transit-times.json'));

  var MARKER_COLOR = '#f0a';

  var geoJson = null;

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

  function filterGeoJson(query) {
    var geoJson = toGeoJson();
    query = query.trim().toLowerCase();
    if (!query) return geoJson;
    return geoJson.filter(function(item) {
      return item.properties.schools.some(function(school) {
        return school.name.toLowerCase().indexOf(query) != -1;
      });
    });
  }

  return {
    toGeoJson: toGeoJson,
    filterGeoJson: filterGeoJson
  };
});
