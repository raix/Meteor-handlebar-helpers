#Handlebar-helpers
Is a simple way of using sessions and collections in the Meteor handlebars template environment

Have a look at [Live example](http://handlebar-helpers.meteor.com/)

There are some simple handlers
* __{{$.javascript /* arguments */ }}  // The new $cript helper__
* {{$.Session.get key}}
* {{$.Session.equals key value}}
* {{getLength a}} *returns length property*
* {{$.Meteor.status.connected}}
* {{$.Meteor.userId}}
* {{cutString str maxLen}} *cuts string appends...*
* {{isSelected a b}} *if a equals b then return " selected"*
* {{isChecked a b}} *if a equals b then return " checked"*
* {{$eq a b}} *if a equals b then return true*
* {{$neq a b}} *if not a equals b then return true*
* {{$in a b c d}} *if a equals one of optional values*
* {{$nin a b c d}} *if a equals none of optional values*
* {{$lt a b}}
* {{$gt a b}}
* {{$lte a b}}
* {{$gte a b}}
* {{$and a b}}
* {{$or a b}}
* {{$not a}}
* {{$exists a}} *a != undefined*
* {{getText notation}} *translation!!*

*A special credit goes to @belisarius222 aka Ted Blackman for sparking an idear for a solution for the new $uper helper, Thanks Ted!*

##How to use?

####1. Install:
```
    mrt add handlebar-helpers
```
*Requires ```Meteorite``` get it at [atmosphere.meteor.com](https://atmosphere.meteor.com)*


###The new `$` !
You can now call javascript functions or get variables in directly - *no use of `eval`*
*At the moment only scope allowed is `Session`, `Meteor`, `console` a way to add more scope eg. collections or other is in the works*
```html
Read my session: {{$.Session.get 'mySession'}}

Is my session equal to 4?: {{$.Session.equals 'mySession' 4}}

Does this helper render??: {{$.console.log 'Nope Im writing to the console log...'}}

What user id do I got: {{$.Meteor.userId}}

What's the connection status?: {{$.Meteor.status.status}}

Hmm, I am client right? {{$.Meteor.isClient}}
```
*You can access any global objects/functions/variables - and it's still reactive!!*

###Add objects to the $cope
Use the `Helpers.addScope(name, obj)` to add objects into the `$` scope.
Example:
```js
  Helpers.addScope('Session', Session);
  Helpers.addScope('Meteor', Meteor);
```
*It's the default scope and allows javascript access {{$.Meteor.isClient}} etc.*

###Remove objects from scope
`Helpers.removeScope(name);`

###getText translation
adds a global getText(notation)
Expects a global object to contain translations - fallsback if not found.
```js
    // expects an global array: 
    // its ok if translation is not completed, it fallsback
    languageText = {
        'say.hello.to.me': { 
            en: 'Say hello to me :)'
        },
        'add.organisation': { 
            da: 'Tilføj Organisation', en: 'Add Organisation' 
        }
    };

    // Define case on the run ex.:
    getText('say.hello.to.me') == 'say hello to me :)'; // lowercase
    getText('SAY.HELLO.TO.ME') == 'SAY HELLO TO ME :)'; // uppercase
    getText('Say.hello.to.me') == 'Say hello to me :)'; // uppercase first letter, rest lowercase
    getText('Say.Hello.To.Me') == 'Say Hello To Me :)'; // camelCase

```

```html
  {{getText 'Say.hello.to.me'}}
```
###Set language
Use `Helpers.setLanguage('en');` to change language on the fly.

###Get current language
Use the reactive `Helpers.language()` to get the current language

