define(function(require) {
  var React = require('react');

  var GOOD_TIME = 30;
  var BAD_TIME = 45;

  var StaticTooltip = React.createClass({
    renderProgramInfo: function(programs) {
      if (programs.length == 0) return null;
      return (
        <ul className="list-inline">
          {programs.map(function(program) {
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
          this.props.schools[0].address
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
    renderSchoolInfo: function(school, i) {
      var students = studentsText(school.students, school.grades);
      return (
        <li key={school.name}>
          <div style={{textTransform: 'uppercase'}}>
            <strong>{school.name}</strong>
          </div>
          <div style={{marginBottom: 10}}>
            {i == 0
             ? <div style={{fontSize: 10}}>{school.address}</div>
             : null}
            <div style={{fontSize: 10}}>
              <div>{gradesText(school.grades)}</div>
              <div>{students}</div>
              {school.freeLunch
               ? <div>
                   {school.freeLunch.toFixed(0)}% receive free lunch
                 </div>
               : null}
              {school.reducedLunch
               ? <div>
                   {school.reducedLunch.toFixed(0)}% receive free or reduced-price lunch
                 </div>
               : null}
            </div>
            <div style={{fontSize: 12}}>
              {this.renderProgramInfo(school.programs)}
            </div>
          </div>
        </li>
      );
    },
    renderSchoolsInfo: function() {
      return (
        <ul className="list-unstyled">
          {this.props.schools.map(this.renderSchoolInfo)}
        </ul>
      );
    },
    render: function() {
      var hasStudentsInfo = this.props.schools.some(function(school) {
        return school.students !== null;
      });
      return (
        <div style={{lineHeight: '1.2em'}}>
          {this.renderSchoolsInfo()}
          {this.renderTripInfo()}
          <div className="text-muted" style={{
            fontSize: 9
          }}>
            Transit times are based on taking public transit at
            9:45am on a weekday morning.
            {hasStudentsInfo
             ? <span> Student population is based on the
               2011-12 school year.</span>
             : null}
          </div>
        </div>
      );
    }
  });

  function studentsText(students, grades) {
    if (students === null) return null;
    var text = students + " students";
    if (grades[0] < 9)
      text += " in " + gradesText([9, grades[1]]).toLowerCase();
    return text;
  }

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
