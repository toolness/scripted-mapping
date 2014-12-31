define(function(require) {
  var React = require('react');

  var GOOD_TIME = 30;
  var BAD_TIME = 45;

  var StaticTooltip = React.createClass({
    renderProgramInfo: function() {
      if (this.props.programs.length == 0) return null;
      return (
        <ul className="list-inline">
          {this.props.programs.map(function(program) {
            return <li key={program}><span className="label label-default">{program}</span></li>;
          })}
        </ul>
      );
    },
    renderTripInfo: function() {
      return this.props.trips.map(function(trip) {
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
      }, this);
    },
    render: function() {
      return (
        <div style={{lineHeight: '1.2em'}}>
          <div style={{textTransform: 'uppercase'}}>
            <strong>{this.props.name}</strong>
          </div>
          <div style={{marginBottom: 10}}>
            <div style={{
              fontSize: 10,
              textTransform: 'lowercase'
            }}>{this.props.address}</div>
            <div style={{fontSize: 10}}>{gradesText(this.props.grades)}</div>
            <div style={{fontSize: 12}}>{this.renderProgramInfo()}</div>
          </div>
          {this.renderTripInfo()}
          <div className="text-muted" style={{
            fontSize: 9
          }}>
            Transit times are based on taking public transit at
            9:45am on a weekday morning.
          </div>
        </div>
      );
    }
  });

  function gradesText(grades) {
    if (grades[1] === null) return "Grade " + grades[0];
    return "Grades " + (grades[0] == 0 ? "K" : grades[0]) + '-' + grades[1];
  }

  function googleMapsUrl(from, to) {
    return "https://www.google.com/maps/dir/" +
           encodeURIComponent(from) + '/' + encodeURIComponent(to);
  }

  return StaticTooltip;
});
