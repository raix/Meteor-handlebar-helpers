Package.describe({
  version: '0.0.0',
  summary: "Handlebar helpers"
});

Package.on_use(function (api) {
  // Spark engine requires 'handlebars', Meteor UI requires 'templating'
  api.use(['ui', 'session', 'underscore', 'deps'], 'client'); //Needed by helpers for test and live,

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
           'handlebar-helpers']);
  
  api.add_files(['helpers_tests.html',
                 'helpers_tests.js',
                 ], 'client');

});
