Package.describe({
  name: 'raix:handlebar-helpers',
  version: '0.1.4-pre1',
  summary: "Handlebar helpers"
});

Package.on_use(function (api) {
  if (api.versionsFrom) {

    api.versionsFrom('1.0');

    // Spark engine requires 'handlebars', Meteor UI requires 'templating'
    api.use([
      'ui',
      'session',
      'underscore',
      'deps'
    ], 'client'); //Needed by helpers for test and live,

  } else {

    // Spark engine requires 'handlebars', Meteor UI requires 'templating'
    api.use([
      'ui',
      'session',
      'underscore',
      'deps'
    ], 'client'); //Needed by helpers for test and live,


  }
  
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
           'mongo-livedata']);

  if (api.versionsFrom) {
    api.use('raix:handlebar-helpers');
  } else {
    api.use('handlebar-helpers');
  }
  
  api.add_files(['helpers_tests.html',
                 'helpers_tests.js',
                 ], 'client');

});
