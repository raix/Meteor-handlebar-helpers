Package.describe({
  name: 'raix:handlebar-helpers',
  version: '0.1.3',
  summary: "Handlebar helpers",
  git: "https://github.com/raix/Meteor-handlebar-helpers.git"
});

Package.on_use(function (api) {
  // Spark engine requires 'handlebars', Meteor UI requires 'templating'
  api.use([
    'ui@1.0.0',
    'session@1.0.0',
    'underscore@1.0.0',
    'deps@1.0.0'
  ], 'client'); //Needed by helpers for test and live,

  api.export && api.export('Helpers');

  api.add_files('helpers.operators.js', 'client');
});

Package.on_test(function (api) {
  api.use(['tinytest',
           'ui',
           'test-helpers', 
           'session', 
           'templating',
           'mongo-livedata',
           'raix:handlebar-helpers']);
  
  api.add_files(['helpers_tests.html',
                 'helpers_tests.js',
                 ], 'client');

});
