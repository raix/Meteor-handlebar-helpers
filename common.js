// Helper scope
if (typeof Helpers === 'undefined') {
    Helpers = {};
}

// expects an array: languageText['say.hello.to.me']['en'] = 'Say hello to me:)';
// ex.:
// getText('Say.Hello.To.Me') == 'say hello to me:)'; // lowercase
// getText('SAY.HELLO.TO.ME') == 'SAY HELLO TO ME:)'; // uppercase
// getText('Say.hello.to.me') == 'Say hello to me:)'; // uppercase first letter, rest lowercase
// getText('Say.Hello.To.Me') == 'Say Hello To Me:)'; // camelCase
// getText('SAy.hello.to.me') == 'Say hello To me:)'; // ignore case sensitivity

var _languageDeps = (Meteor.isClient)?new Deps.Dependency():null;
var currentLanguage = 'en';

// language = 'en'
Helpers.setLanguage = function(language) {
  if (language && language !== currentLanguage) {
    currentLanguage = language;
    if (Meteor.isClient) _languageDeps.changed();
  }
};

Helpers.language = function() {
  if (Meteor.isClient) _languageDeps.depend();
  return currentLanguage;
};

// handleCase will mimic text Case making src same case as text
var handleCase = function(text, src) {
  // Return lowercase
  if (text == text.toLowerCase())
    return src.toLowerCase();
  // Return uppercase
  if (text == text.toUpperCase())
    return src.toUpperCase();
  // Return uppercase first letter, rest lowercase
  if (text.substr(1) == text.substr(1).toLowerCase() )
    return src.substr(0, 1).toUpperCase()+src.substr(1).toLowerCase();
  // Return src withour changes
  if (text.substr(0,2) == text.substr(0,2).toUpperCase())
    return src;
  // Return CamelCase
  return src.replace(/( [a-z])/g, function($1){
    return $1.toUpperCase();
  });
}

Helpers.getText = function(text) {
  var txt = text.toLowerCase();
  // TODO: Tidy the return line - kinda messy
  return handleCase(text, (languageText && languageText[txt])?( (languageText[txt][Helpers.language()])?languageText[txt][Helpers.language()]: languageText[txt].en):'['+text+']' );
};