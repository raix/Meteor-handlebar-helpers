#Handlebar-helpers
Is a simple way of using sessions and collections in the Meteor handlebars template environment

Have a look at [Live example](http://handlebar-helpers.meteor.com/)

There are some simple handlers
* {{getSession key}}
* {{sessionEquals key value}}
* {{find collection query options}}
* {{findOne collection query options}}
* {{getLength a}} *returns length property*
* {{isConnected}}
* {{getUser userId}} 
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

##How to use?

####1. Install:
```
    mrt add handlebar-helpers
```
*Requires ```Meteorite``` get it at [atmosphere.meteor.com](https://atmosphere.meteor.com)*

###Get session variable:
The ```{{getSession 'foo'}}``` helper returns the value of session variable 'foo'
In the template:
```html
<h1>{{getSession 'foo'}}</h1>
``` 
In the controller:
```js
  Session.set('foo', 'bar');
```
###Compare session to value:
The ```{{sessionEquals 'foo' 'bar'}}``` compares session 'foo' value with the ```string``` value 'bar'.
Can use ``integer``` and ```boolean``` values for comparing aswell. *arrays and objects are invalids due to contrains in Meteor and handlebars*
```html
{{#if sessionEquals 'foo' 'bar'}}
  session 'foo' equals the value 'bar'
{{else}}
  session 'foo' doesn't equal the value 'bar'
{{/if}}
```
###Get data in from collection
The ```{{find 'foo' '{}'}}``` and ```{{findOne 'foo' '{}'}}``` will return qurey '{}' result from collection defined as ```var foo = new Meteor.Collection("myFooCollection")```
From the ```demoHelpers``` example:

```html
  {{#each find 'testCollection' '{}' '{ "sort": { "createdAt":1 } }'}}
    {{name}} - timeStamp: {{createdAt}}</br>
  {{else}}
    You never clicked the button
  {{/each}}
```
*Note: query and options should be formatted as json, since attributes as Objects and Arrays aren't supported by the Meteor handlebars*

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
Use `Session.set('language', 'en');` to change language on the fly.

