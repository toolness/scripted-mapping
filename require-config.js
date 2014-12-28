var require = {
  paths: {
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
    "underscore": {
      exports: "_"
    }
  },
  // Grrr. http://stackoverflow.com/a/8479953
  urlArgs: "bust=" + Date.now()
};
