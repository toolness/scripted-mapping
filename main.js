require([
  "react",
  "jsx!src/app"
], function(React, App) {
  var app = React.render(
    React.createElement(App, {
    }),
    document.getElementById('app')
  );

  // For debugging purposes only!
  window.app = app;
});
