define(function(require) {
  var React = require('react');
  var L = require('mapbox');

  var App = React.createClass({
    componentDidMount: function() {
      this.map = L.mapbox.map(this.refs.map.getDOMNode(),
                              this.props.mapboxId);
    },
    componentWillUnmount: function() {
      this.map.remove();
      this.map = null;
    },
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
            <div ref="map" style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              height: 'calc(100% - 50px)'
            }}></div>
          </div>
        </div>
      );
    }
  });

  return App;
});
