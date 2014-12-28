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
            if (mins <= GOOD_TIME) color = 'green';
            if (mins >= BAD_TIME) color = 'red';
            return (
              <p key={trip.origin}>
                <small><span style={{
                  color: color
                }}>{mins} minutes</span> from {trip.origin}</small>
              </p>
            );
          })}
        </div>
      );
    }
  });

  return StaticTooltip;
});
