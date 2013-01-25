var testCol = new Meteor.Collection('testcol');
testCol.bindTemplate('hello', {
      liveUpdate: false,        //Set true if should be live update, if false then collective update eg. via button
      dirtyMark: '<b>*</b>',    //Deprecating Prefix dirty html mark at input
      validation: {
        errorMessage: '<div class="alert alert-block">The email field should contain a valid email</div>',
        successMessage: "",
        email: {
          errorMessage: '<span class="label label-important">!</span>',
          successMessage: "",
          validators: [ Validators.email ]
        }
      }
    }); 

//errorMessage and successMessage is deprecating...


if (Meteor.isClient) {
  Template.hello.greeting = function () {
    return "Test wellcome";
  };

  Template.hello.events({
    'click .btnClick' : function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
      testCol.insert({name:'test4', time: Date.now() });
      Session.set('test', 'Ok');
    },
    'click .btnReset': function() {
      testCol.remove({});
    },
    'click .btnInspect' : function() {
      console.log(this);
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
