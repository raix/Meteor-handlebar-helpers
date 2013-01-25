Package.describe({
  summary: "Handlebar bind",
  internal: true
});

Package.on_use(function (api, where) {
  api.use(['handlebars'], 'server'); //Needed by helpers for test and live,

  api.add_files(['bind-collection.js', 'bind-helpers.js', 'bind-record.js', 'bind-validators.js'], ['client', 'server']);
});

Package.on_test(function (api) {
  api.use(['tinytest', 
           'test-helpers', 
           'session', 
           'templating',
           'mongo-livedata']);
  
  api.add_files(['bind_tests.html',
                 'bind_tests.js',
                 ], 'client');

});
