//Handlebar helper
(function () {
  if (typeof Handlebars !== 'undefined') {
    //{{getSession 'key'}}

    /*
    bind - Binds data to input - not yet tested for textarea, checkbox, option etc.
     */
    Handlebars.registerHelper('bind', function (key) {
      //Test if key found?
      if (!key || key=='_id' || key instanceof Object)
        return; // {{bind}} lacks user intend for bind action, cannot alter _id
      var setValue = (this[key])?(' value="'+_.escape(this[key])+'"'):'value=""'; //Only set value if key found
      //If key not found then the binding could be on new data set or fail use
      var setBindKey = 'bindKey="'+key+'"';                                //Attach bind to data key in collection record
      var setId = 'id="'+((this._id)?this._id:'unknown')+'.'+key+'"';      //Preserve input
      return new Handlebars.SafeString(setValue+setBindKey+setId);          //Output element's: [value] bindKey id
    });
    /*
    bindAction - Binds input/button or anchor to a bind action eg. create, update, delete, cancel
     */
    Handlebars.registerHelper('bindAction', function (action) {
      return new Handlebars.SafeString('bindAction="'+action+'" id="'+((this._id)?this._id:'unknown')+'.__'+action+'"');
    });

    Handlebars.registerHelper('isBindDirty', function (key) {
      var setId = 'id="isBindDirty.'+((this._id)?this._id:'unknown')+'.'+key+'"';
      return new Handlebars.SafeString('<span '+setId+' class="isBindDirty"></span>');
    });

    Handlebars.registerHelper('bindMessage', function (key) {
      var myKey = (key instanceof Object)?'':'.'+key;
      var setId = 'id="__bindMsg.'+((this._id)?this._id:'unknown')+myKey+'"';
      return new Handlebars.SafeString('<span '+setId+' class="bindMessage"></span>');
    });

    Handlebars.registerHelper('validationMsg', function (data, options) {
      if (!data || (data instanceof Array && !data.length))
        return options.inverse(this);
      else
        return options.fn(this);
    });

    Handlebars.registerHelper('bindStatus', function (template, bindKey, attribute) {
      var records = (template && Template[template])?Template[template].bindRecord:undefined;
      var statusRecord = (records && this._id && records[this._id])? records[this._id]:undefined;
      var statusKey = (statusRecord && bindKey)? statusRecord[bindKey]:undefined;
      var statusAttribute = (statusKey && attribute)? statusKey[attribute]:undefined;
      return statusAttribute || statusKey || statusRecord || { error: true};  
    });

    //TODO: Replace all document.getElementById with template in scope findAll
    //TODO: Validation errors should contain a state eg. 1 warning 2 if required then its an error
    //TODO: Create validationMessage template [key] make a blok that gives an object:
    //        Error count, status (error/warning)
    //TODO: Checkup on Template.help.validationErrors - seems empty
    //BUG: seems as if validationsErrors is sluggish / a step behind?
    //TODO: try validationMsg or make a ValidationFailed
  }
})();