define(function(require) {
  var React = require('react');

  var GOOD_TIME = 30;
  var BAD_TIME = 45;

  var StaticTooltip = React.createClass({
    render: function() {
      return (
        <div>
          <p><strong>{this.props.name}</strong></p>
          {this.props.trips.map(function(trip) {
            var mins = Math.floor(trip.duration / 60);
            var color = 'black';
            var url = googleMapsUrl(
              trip.origin.address,
              this.props.name + ', ' + this.props.address
            );
            if (mins <= GOOD_TIME) color = 'green';
            if (mins >= BAD_TIME) color = 'red';
            return (
              <p key={trip.origin.name}>
                <small><span style={{
                  color: color
                }}>{mins} minutes</span> from <a href={url} style={{
                  color: 'inherit',
                  textDecoration: 'underline'
                }} target="_blank">{trip.origin.name}</a></small>
              </p>
            );
          }, this)}
          <div className="text-muted" style={{
            fontSize: 9,
            lineHeight: '10px'
          }}>
            Transit times are based on taking public transit at
            9:45am on a weekday morning.
          </div>
        </div>
      );
    }
  });

  function googleMapsUrl(from, to) {
    return "https://www.google.com/maps/dir/" +
           encodeURIComponent(from) + '/' + encodeURIComponent(to);
  }

  return StaticTooltip;
});
