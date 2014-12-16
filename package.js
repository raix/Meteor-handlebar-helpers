Package.describe({
  name: 'raix:handlebar-helpers',
  version: '0.2.0',
  summary: "Handlebar helpers"
});

Package.on_use(function (api) {

  api.versionsFrom('1.0');

  // Spark engine requires 'handlebars', Meteor UI requires 'templating'
  api.use([
    'ui',
    'session', // we add Session to the helper scope
    'underscore', // Uses _.bind
    'deps'
  ], 'client'); //Needed by helpers for test and live,
  
  api.export('Helpers');
  api.add_files('common.js', ['client', 'server']);
  api.add_files('helpers.operators.js', 'client');
});

Package.on_test(function (api) {
  api.use(['tinytest',
           'ui',
           'test-helpers', 
           'session', 
           'templating',
           'blaze',
           'mongo-livedata']);

  api.use('raix:handlebar-helpers');
  
  api.add_files(['helpers_tests.html',
                 'helpers_tests.js',
                 ], 'client');

});
