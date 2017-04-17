if (typeof UI !== 'undefined') {
  UI.registerHelper('$log', function(val){
    console.log(val);

    return val;
  });
}