//This object should maybe have its own life / file / package as a git project?
var Validators = {
  email: function(value) {
    var re = /\S+@\S+\.\S+/;
    return (re.test(value) || !value);
  },
  shouldBeLongerThan: function(len) {
    return function(value) {
      return (value.length > len); //All validators should accept empty input except required
    };
  },
  //Required is the ONLY validation function that not accept empty value
  required: function(value) { return (value != '' && value != null && value != undefined); }
};