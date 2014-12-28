define(function(require) {
  var React = require('react');
  var L = require('mapbox');

  var Map = React.createClass({
    componentDidMount: function() {
      this.map = L.mapbox.map(this.getDOMNode(),
                              this.props.mapboxId);
      this.map.featureLayer.on('layeradd', function(e) {
        var marker = e.layer;
        var feature = marker.feature;
        var staticHtml = React.renderToStaticMarkup(
          React.createElement(this.props.staticTooltip, feature.properties)
        );
        marker.bindPopup(staticHtml, {
          closeButton: false
        });
      }.bind(this));
      this.map.featureLayer.setGeoJSON(this.props.geoJson);
      this.map.fitBounds(this.map.featureLayer.getBounds());
    },
    componentWillUnmount: function() {
      this.map.remove();
      this.map = null;
    },
    render: function() {
      return <div style={this.props.style}/>;
    }
  });

  return Map;
});
