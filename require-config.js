var require = {
  paths: {
    "mapbox": "https://api.tiles.mapbox.com/mapbox.js/v2.1.4/mapbox",
    "underscore": "vendor/underscore",
    "text": "vendor/require.text",
    "jsx": "vendor/require.jsx",
    "JSXTransformer": "vendor/react/build/JSXTransformer",
    "react": "vendor/react/build/react-with-addons"
  },
  jsx: {
    fileExtension: '.jsx'
  },
  shim: {
    "mapbox": {
      exports: "L"
    },
    "underscore": {
      exports: "_"
    }
  },
  // Grrr. http://stackoverflow.com/a/8479953
  urlArgs: "bust=" + Date.now()
};
