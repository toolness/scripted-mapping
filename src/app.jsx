define(function(require) {
  var React = require('react');
  var Search = require('jsx!./search');
  var Map = require('jsx!./map');
  var StaticTooltip = require('jsx!./static-tooltip');
  var schools = require('./schools');

  // http://getbootstrap.com/components/#navbar-fixed-top
  var STATUS_BAR_HEIGHT = 50;

  var App = React.createClass({
    getInitialState: function() {
      return {query: ''};
    },
    handleSearchChange: function(query) {
      this.setState({query: query});
    },
    render: function() {
      var geoJson = schools.filterGeoJson(this.state.query);

      return (
        <div>
          <nav className="navbar navbar-default navbar-fixed-top">
            <div className="container-fluid">
              <div className="navbar-header">
                <a className="navbar-brand" href="#">ScriptED Mapping</a>
              </div>
              <Search className="navbar-form navbar-left" defaultQuery={this.state.query} onChange={this.handleSearchChange}/>
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
            }} geoJson={geoJson} staticTooltip={StaticTooltip}/>
          </div>
        </div>
      );
    }
  });

  return App;
});
