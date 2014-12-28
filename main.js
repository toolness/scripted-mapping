require([
  "react",
  "mapbox",
  "jsx!src/app"
], function(React, L, App) {
  L.mapbox.accessToken = "pk.eyJ1IjoidG9vbG5lc3MiLCJhIjoiaDlMSWhBWSJ9." +
                         "6k51DcAT00VS8XG0EE1gUg";
  var app = React.render(
    React.createElement(App, {
      mapboxId: 'toolness.kk075m34'
    }),
    document.getElementById('app')
  );

  // For debugging purposes only!
  window.app = app;
});
