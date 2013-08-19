Package.describe({
  summary: "Handlebar helpers",
  internal: true
});

Package.on_use(function (api, where) {
  api.use('standard-app-packages', 'client');

  api.add_files(
          ['helpers.db.js',
          'helpers.operators.js'
          ], 'client');
});

Package.on_test(function (api) {
  api.use(['tinytest', 
           'test-helpers', 
           'session', 
           'templating',
           'mongo-livedata']);
  
  api.add_files(['helpers_tests.html',
                 'helpers_tests.js',
                 ], 'client');

});
