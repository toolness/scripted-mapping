define(function(require) {
  var React = require('react');

  var App = React.createClass({
    render: function() {
      return (
        <div>
          <nav className="navbar navbar-default">
            <div className="container-fluid">
              <div className="navbar-header">
                <a className="navbar-brand" href="#">ScriptED Mapping</a>
              </div>
              <ul className="nav navbar-nav navbar-right">
                <li>
                  <a href="data/transit-times.csv" target="_blank">
                    <span className="glyphicon glyphicon-download">
                    </span> Download CSV
                  </a>
                </li>
              </ul>
            </div>
          </nav>
          <div className="container-fluid">
            <h1>Hello!</h1>
            <p>Eventually, there will be a map here, but right now there isn't much.</p>
          </div>
        </div>
      );
    }
  });

  return App;
});
