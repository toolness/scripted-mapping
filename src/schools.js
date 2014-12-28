define(function(require) {
  var _ = require('underscore');
  var geocodes = JSON.parse(require('text!data/geocode-addresses.json'));
  var schools = JSON.parse(require('text!data/nyc-school-addresses.json'));
  var origins = JSON.parse(require('text!data/origin-points.json'));
  var trips = JSON.parse(require('text!data/transit-times.json'));

  var MARKER_COLOR = '#f0a';

  var geoJson = null;

  // http://stackoverflow.com/a/1054862
  function slugify(text) {
    return text
     .toLowerCase()
     .replace(/ /g,'-')
     .replace(/[^\w-]+/g,'');
  }

  function toGeoJson() {
    if (geoJson) return geoJson;

    var ids = {};
    geoJson = [];
    schools.forEach(function(school) {
      var id = slugify(school.name);
      var geocode = geocodes[school.address];
      var tripInfo = origins.map(function(origin) {
        var trip = trips[origin.address][school.address];
        if (!trip)
          throw new Error("No trip data for " + school.address);
        return {
          origin: origin.name,
          duration: trip.duration
        };
      });
      if (id in ids) {
        console.log("Warning, duplicate school id: " + id);
        return;
      }
      if (!geocode)
        throw new Error("No geocode data for " + school.address);
      ids[id] = true;
      geoJson.push({
        type: 'Feature',
        id: id,
        geometry: {
          type: 'Point',
          coordinates: [geocode.lng, geocode.lat]
        },
        properties: _.extend({}, school, {
          'trips': tripInfo,
          'marker-size': 'small',
          'marker-color': MARKER_COLOR
        })
      });
    });

    return geoJson;
  }

  return {
    toGeoJson: toGeoJson
  };
});
