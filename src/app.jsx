define(function(require) {
  var React = require('react');
  var Map = require('jsx!./map');

  // http://getbootstrap.com/components/#navbar-fixed-top
  var STATUS_BAR_HEIGHT = 50;

  var App = React.createClass({
    render: function() {
      return (
        <div>
          <nav className="navbar navbar-default navbar-fixed-top">
            <div className="container-fluid">
              <div className="navbar-header">
                <a className="navbar-brand" href="#">ScriptED Mapping</a>
              </div>
              <ul className="nav navbar-nav navbar-right hidden-xs">
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
            <Map mapboxId={this.props.mapboxId} style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              height: 'calc(100% - ' + STATUS_BAR_HEIGHT + 'px)'
            }}/>
          </div>
        </div>
      );
    }
  });

  return App;
});
