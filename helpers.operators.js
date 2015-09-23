// Forward compability
if (typeof UI === 'undefined' || typeof UI.registerHelper !== 'function') {
  UI = {
    registerHelper: function(name, f) {
      if (typeof Handlebars !== 'undefined') {
        return Handlebars.registerHelper(name, f);
      } else {
        throw new Error('No UI or Handlebars found');
      }
    }
  };
}

if (typeof UI !== 'undefined') {
    UI.registerHelper('getLength', function (a) {
      return a && a.length;
    });

    UI.registerHelper('isSelected', function (a, b) {
      return (a === b) ? { selected: 'selected' } : null;
    });

    UI.registerHelper('isChecked', function (a, b) {
      return (a === b) ? { checked: 'checked' } : null;
    });

    UI.registerHelper('cutString', function (str, len) {
      return (str.length > len)?str.substr(0, Math.max(len-3, 0))+'...':str;
    });

    UI.registerHelper('$eq', function (a, b) {
      return (a === b); //Only text, numbers, boolean - not array & objects
    });

    UI.registerHelper('$neq', function (a, b) {
      return (a !== b); //Only text, numbers, boolean - not array & objects
    });

    UI.registerHelper('$in', function (a, b, c, d) {
      return ( a === b || a === c || a === d);
    });

    UI.registerHelper('$nin', function (a, b, c, d) {
      return ( a !== b && a !== c && a !== d);
    });

    UI.registerHelper('$exists', function (a) {
      return ( a !== undefined);
    });

    UI.registerHelper('$lt', function (a, b) {
      return (a < b);
    });

    UI.registerHelper('$gt', function (a, b) {
      return (a > b);
    });

    UI.registerHelper('$lte', function (a, b) {
      return (a <= b);
    });

    UI.registerHelper('$gte', function (a, b) {
      return (a >= b);
    });


    UI.registerHelper('$and', function (a, b) {
      return (a && b);
    });

    UI.registerHelper('$or', function (a, b) {
      return (a || b);
    });

    UI.registerHelper('$not', function (a) {
      return (!a);
    });

    UI.registerHelper('nl2br', function (text) {
        var nl2br = (text + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + '<br>' + '$2');
        return new Spacebars.SafeString(nl2br);
    });

    UI.registerHelper('getText', function (text, lang) { // Deprecating
      var langKey = lang || null;
      return Helpers.getText(text, langKey);
    });
    
  UI.registerHelper("$mapped", function(arr) {
    if(!Array.isArray(arr)){
      try {
        arr = arr.fetch()
      }
      catch (e){
        console.log("Error in $mapped: perhaps you aren't sending in a collection or array.")
        return [];
      }
    }
    
    var $length = arr.length;
    
    var mappedArray = arr.map(function(item,index) {
      item.$length = $length;
      item.$index = index;
      item.$first = index === 0;
      item.$last  = index === $length-1;
      return item;
    });
    
    return mappedArray || [];
  });
  
    // UI.registerHelper('userRole', function ( /* arguments */) {
    //   var role = Session.get('currentRole');
    //   return _.any(arguments, function(value) { return (value == role); });
    // });

    /*
        Then $uper helper - Credit goes to @belisarius222 aka Ted Blackman for sparking an idear for a solution
    */
    Helpers.superScope = {};

    Helpers.addScope = function(name, obj) {
      // TODO: Get rid of underscore
      Helpers.superScope[name] = _.bind(function() { return this; }, obj);
    };

    Helpers.removeScope = function(name) {
      delete UI._globalHelpers[name];
      delete Helpers.superScope[name];
    };
    
    Helpers.addScope('Session', Session);
    Helpers.addScope('Meteor', Meteor);

    UI.registerHelper('$', function() {
      return Helpers.superScope;
    });
}
