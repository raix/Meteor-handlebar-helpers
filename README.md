# DEPRECATED: This package is no longer maintained

#raix:Handlebar-helpers [![Build Status](https://travis-ci.org/raix/Meteor-handlebar-helpers.png?branch=master)](https://travis-ci.org/raix/Meteor-handlebar-helpers)

#### Important!

Current version uses Blaze. If you need to use the Spark version, get `0.0.9`.

This package provides a simple way of using sessions and collections in the Meteor Spacebars template environment.

Have a look at the [Live example](http://handlebar-helpers.meteor.com/)

Here are some simple helpers:
* __{{$.javascript /* arguments */ }}  // The new $script helper__
* {{$.Session.get key}}
* {{$.Session.equals key value}}
* {{getLength a}} *returns length property*
* {{$.Meteor.status.connected}}
* {{$.Meteor.userId}}
* {{cutString str maxLen}} *cuts string appends...*
* {{nl2br text}} *nl2br function for text
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
* {{$mapped cursor}} *can take cursor or array*
* {{$exists a}} *a != undefined*
* {{getText notation}} *translation!!*

*A special credit goes to @belisarius222 aka Ted Blackman for sparking an idear for a solution for the new $uper helper, Thanks Ted!*

## Usage

#### 1. Install:
```
    meteor add raix:handlebar-helpers
```


### The new `$` !
You can now call JavaScript functions or get variables in directly - *no use of `eval`*
*At the moment the only scopes allowed are `Session`, `Meteor`, and `console`. A way to add more scopes, e.g. Collections or others, is in the works*.

```html
Read my session: {{$.Session.get 'mySession'}}

Is mySession equal to 4?: {{$.Session.equals 'mySession' 4}}

Does this helper render??: {{$.console.log 'Nope Im writing to the console log...'}}

What user id do I have: {{$.Meteor.userId}}

What's the connection status?: {{$.Meteor.status.connected}}

Hmm, I am client right? {{$.Meteor.isClient}}
```
*You can access any global objects/functions/variables - and it's still reactive!!*


### $mapped

Mapped each will map $first, $last, and $index onto your cursor or array
```html
{{#each $mapped myCursor}}
    {{name}}{{#unless $last}},{{/unless}}
{{/each}}
```

### Add objects to the $cope

Use the `Helpers.addScope(name, obj)` to add objects into the `$` scope.

Example:
```js
  Helpers.addScope('Session', Session);
  Helpers.addScope('Meteor', Meteor);
```
*It's the default scope and it allows JavaScript access: {{$.Meteor.isClient}} etc.*


### Remove objects from scope
`Helpers.removeScope(name);`


### getText translation

[CLIENT/SERVER]

Adds a global getText(notation)

Expects a global object to contain translations - falls back if not found.

```js
    // expects a global array: 
    // it's ok if translation is not completed, it falls back
   
    Helpers.setDictionary({
        'say.hello.to.me': { 
            en: 'Say hello to me :)'
        },
        'add.organisation': { 
            da: 'Tilføj Organisation', en: 'Add Organisation' 
        }
    });

    // Use to extend the dictionary
    Helpers.addDictionary({})

    // Define case on the run ex.:
    getText('say.hello.to.me') == 'say hello to me :)'; // lowercase
    getText('SAY.HELLO.TO.ME') == 'SAY HELLO TO ME :)'; // uppercase
    getText('Say.hello.to.me') == 'Say hello to me :)'; // uppercase first letter, rest lowercase
    getText('Say.Hello.To.Me') == 'Say Hello To Me :)'; // camelCase
    getText('SAy.hello.to.me') == 'Say hello to me :)'; // ignore case sensitivity

```

```html
  {{getText 'Say.hello.to.me'}}
```

### Set language

Use `Helpers.setLanguage('en');` to change language on the fly.

### Get current language

Use the reactive `Helpers.language()` to get the current language
