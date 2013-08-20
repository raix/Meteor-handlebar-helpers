testCollection = new Meteor.Collection('test');

if (Meteor.isClient) {
  

  languageText = {
      'say.hello.to.me': { 
          en: 'Say hello to me :)'
      }
  };

  // TODO: would be nice if this could work:
  Helpers.addScope('testCollection', testCollection);

  Session.set('appTitle', 'Hello handlebar helpers');

  Template.hello.greeting = function () {
    return "Welcome to demoHelpers.";
  };

  Template.hello.events({
    'click .clickTheButton' : function () {
      // template data, if any, is available in 'this'
        Session.set('appTitle', 'You pressed the button');
        testCollection.insert({ name: 'Click', createdAt: Date.now() });
    },
    'click .clickReset' : function () {
      // template data, if any, is available in 'this'
        Session.set('appTitle', 'You pressed the reset button!!');
        testCollection.find().forEach(function(doc) {
          testCollection.remove({ _id: doc._id });
        });
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
