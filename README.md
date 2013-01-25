#Handlebar-bind - This is early sneak peek test state!
Is a simple way of binding Collections to the Meteor handlebars template environment.

Have a look at [Live example](http://handlebar-helpers.meteor.com/)

There are 4 simple handlers
* {{bind}}
* {{bindAction}}
* {{bindStatus}}
* {{bindStatusReport}}

##How to use?

####1. Install:
```
    mrt add handlebar-bind
```
*Requires ```Meteorite``` get it at [atmosphere.meteor.com](https://atmosphere.meteor.com)*

###Binding Template to Collection :
```js
  var Contacts = new Meteor.Collection('contacts');
  Contacts.bindTemplate('hello');
```
*It's only possible to bind a template once, binding it multiple times will throw an error*

###Using ```{{bind 'key'}}``` helper:
This helper sets an properties ```id```, ```bindKey``` and ```value``` for the tag ```<input>``` * at the moment this is the only input supported*
Here's an example using the ```{{find}}``` from the ```handlebar-helpers``` package:
```html
  {{#each find 'Contacts' '{}'}}
    <input {{bind 'name'}}/><br/>
  {{/each}}
```
*To make this a simple live / twoway binding set option ```liveUpdate:true``` eg.: ```Contacts.bindTemplate('hello', { liveUpdate: true });```*

###Using ```{{bindAction 'Action'}} helper:
This helper lets you define tags: ```<a class="btn">```, ```<button>``` and ```<input>``` as an binding for actions: ```create```, ```update```, ```delete``` and ```cancel``` - last one resets the form fields to default *```cancel``` doesn't work when liveUpdate:true as this updates database live on keystrokes*
```html
  {{#each find 'Contacts' '{}'}}
    <input {{bind 'name'}}/>
    <button {{bindAction 'update'}}>Update</button>
    <a {{bindAction 'cancel'}} class="btn">Cancel</a>
    <input type="button" value="Delete" {{bindAction 'delete'}}/>
    <br/>
  {{/each}}
```
This will list existing contacts names for optional ```update``` and ```delete``` actions.
If one wants to add a contact this can be done by adding bindings outside the data iteration. Example:
```html
  Add contact:<br/>
  <input {{bind 'name'}}/>
  <button {{bindAction 'create'}}>Add</button>
  <button {{bindAction 'cancel'}}>Cancel</button>
  Existing contacts:<br/>
  {{#each find 'Contacts' '{}'}}
    <input {{bind 'name'}}/>
    <button {{bindAction 'update'}}>Update</button>
    <a {{bindAction 'cancel'}} class="btn">Cancel</a>
    <input type="button" value="Delete" {{bindAction 'delete'}}/>
    <br/>
  {{/each}}
```
This way input forms can be used for modal views, and in multiple templates - since multiple templates can be binded to a single Collection.

###Validation using ```{{bindStatus 'templateName'}}```:
Validation using handlebar-bind is a bit more complicated and needs to be set up before working.
*I've only made a couple validators so far, but if you want to share a validation function your wellcome. I would add it to the ```Validators``` object*

####There are three types of data validation:
* Dirty data - this is when data in formula and database dont match
* Required data - data not filled in but is required
* Invalid data - Custom validation failure, a validator allows ```''``` but validates the given value and returns ```false``` - the data is invalid

####Setting client side validation:
```js
      var Contacts = new Meteor.Collection('contacts');
      Contacts.bindTemplate('hello', {
      liveUpdate: false,  //Set true if should be live update, if false then collective update eg. via bindAction
      validation: {
        email: {
          validators: [ Validators.email ] //Supports multiple validators
        }
      }
    });
```
*The data binding for 'email' in Contacts Collection and Template 'hello' is validated against ```Validators.email``` function - Note that an empty string ```''``` is accepted.* 

Validations are weigthed in the sense of three levels of acceptance:
* 0 - ```Success``` - if value is valid
* 1 - ```Warning``` - if a not required field is invalid
* 2 - ```Error``` - if a required field is invalid

All of the ```validations``` and ```dirty data marks``` are kept in a ```bindRecord``` object. The ```bindRecord``` is a reactive data source - giving instant live validation updates in the templating system.

###Validation data from the ```bindRecord``` can be used in three levels:
* ```Attribute``` level - only one attribute eg. ```dirty``` from a key ```email``` gets returned
* ```Key``` level - only validation data from a single field
* ```Record``` level - only validation data from one data context

####Attribute level - Using the ```{{bindStatus 'templateName' 'key' 'attribute'}}```
This helper returns a boolean true/false value from a key attribute (```success```, ```warning```, ```error```, ```dirty```)

Example:
```html
  Add contact:<br/>
  <input {{bind 'name'}}/>
  <input {{bind 'email'}}/>
  {{#if bindStatus 'hello' 'email' 'dirty'}}*{{/if}}
  {{#if bindStatus 'hello' 'email' 'warning'}}?{{/if}}
  {{#if bindStatus 'hello' 'email' 'error'}}!{{/if}}
```

####Key level - Using the ```{{bindStatus 'templateName' 'key'}}```
This helper returns the ```bindRecord``` at key level.
Returned object structure:
```js
{
    success: true/false,
    warning: true/false,
    error: true/false,
    dirty: true/false
}
```
Example:
```html
  Add contact:<br/>
  <input {{bind 'name'}}/>
  <input {{bind 'email'}}/>
  {{#with bindStatus 'hello' 'email'}}
    {{#if dirty}}*{{/if}}
    {{#if error}}!{{/if}}
  {{/with}}
  <button {{bindAction 'create'}}>Add</button>
  <button {{bindAction 'cancel'}}>Cancel</button>
  Existing contacts:<br/>
  {{#each find 'Contacts' '{}'}}
    <input {{bind 'name'}}/>
    <input {{bind 'email'}}/>
    <button {{bindAction 'update'}}>Update</button>
    <a {{bindAction 'cancel'}} class="btn">Cancel</a>
    <input type="button" value="Delete" {{bindAction 'delete'}}/>
    <br/>
  {{/each}}
```

####Record level - Using the ```{{bindStatus 'templateName'}}```
This helper returns the ```bindRecord``` at record level.
Returned object structure:
```js
[
    name: {
        success: true/false,
        warning: true/false,
        error: true/false,
        dirty: true/false
    },
    email: {
        success: true/false,
        warning: true/false,
        error: true/false,
        dirty: true/false
    }
]
```

####Template level - Using the ```{{bindStatusReport 'templateName'}}```
This helper returns the ```bindRecord``` at template level.
Returned object structure: ```[key]{attribute}``` containing counts.

```js
[
    name: {
        success: 0 .. ?,
        warning: 0 .. ?,
        error: 0 .. ?,
        dirty: 0 .. ?
    },
    email: {
        success: 0 .. ?,
        warning: 0 .. ?,
        error: 0 .. ?,
        dirty: 0 .. ?
    }
]
```
