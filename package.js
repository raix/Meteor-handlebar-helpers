Package.describe({
  summary: "Handlebar helpers",
  internal: true
});

Package.on_use(function (api) {
  api.use(['handlebars', 'session', 'underscore', 'deps'], 'client'); //Needed by helpers for test and live,

  api.export && api.export('Helpers');

  api.add_files('helpers.operators.js', 'client');
});

Package.on_test(function (api) {
  api.use(['tinytest',
           'handlebars',
           'test-helpers', 
           'session', 
           'templating',
           'mongo-livedata',
           'domutils',
           'handlebar-helpers']);
  
  api.add_files(['helpers_tests.html',
                 'helpers_tests.js',
                 ], 'client');

});
