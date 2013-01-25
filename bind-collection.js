//Meteor.Collection Template event extend
_.extend(Meteor.Collection.prototype, {
  bindTemplate: function(template, options) {
    var myColl = this;
    if (Meteor.isClient) {
        if (Template[template].bindRecord && Template[template].collectionBinding)
          throw new Error('Template '+template+' is allready binded to collection on data '+Template[template].collectionBinding._name);
        Template[template].bindRecord = new BindRecord(); //Record to update, a list with key as _id, contains array of key and node.
        Template[template].validationErrors = [];
        Template[template].validation = (options)?options.validation:undefined;
        Template[template].collectionBinding = this;
        Template[template].dirtyMark = (options)?options.dirtyMark:undefined;
        Template[template].events({
          'click input': function(e, temp) {
            myColl.doBindAction(template, this, e.target);
          },
          'click a.btn': function(e, temp) {
            myColl.doBindAction(template, this, e.target);
          },
          'click button': function(e, temp) {
            myColl.doBindAction(template, this, e.target);
          },
          'keyup input': function(e) {
            //Do live twoway binding or make user press the binded action?
            if ( (options && options.liveUpdate === true) && this._id != undefined)
              myColl.bindUpdateLive(this, e.target) //Live data for _id records, new records require binding action
            else
              myColl.bindToRecord(template, this, e.target);  //Force the binded action
          }
        });
    } //EO isClient  
  },
  bindUpdateLive: function(data, element) {
    var myColl = this;
    var newData = {};
    var bindkey = (element)?element.getAttribute('bindKey'):'';
    if (!bindkey || !data || !element)  //Got to have key, data and an DOM element
      return;
    if (bindkey != '_id' && element)
      if (!data[bindkey] || this.getBindInputValue(element) != data[bindkey])
        newData[bindkey] = this.getBindInputValue(element);
    if (Object.keys(newData).length != 0)
      myColl.update({_id: data._id}, { $set: newData});
  },
  bindToRecord: function(template, data, target) {
    //bindKey=name id=unknown.name
    //bindKey=name id=id.name
    var bindkey = (target)?target.getAttribute('bindKey'):''; //This could be done from id?
    var value = this.getBindInputValue(target);
    //Get the template
      var temp = Template[template];
    //Set unified id
    var unifiedId = (data._id)?data._id:'unknown';
    //Set unified data as existing or empty
    var unifiedData = (data._id)?data:{};
    //If its a new record then set default for key
    if (!unifiedData[bindkey]) unifiedData[bindkey] = ''; //Default value for key
    if (temp && temp.bindRecord && target) { //Is there objects to work with?

      if (this.getBindInputValue(target) != unifiedData[bindkey]) { //If data is altered / dirty then

        this.setDirtyMark(unifiedId, bindkey, temp.dirtyMark); //DEPRECATE
        this.bindValidate(template, bindkey, unifiedId, value);  //DEPRECATE

        temp.bindRecord.record(unifiedId, bindkey).node(target);
        //## VALIDATION
        var validators = (temp.validation&&temp.validation[bindkey])?temp.validation[bindkey].validators:undefined; //Can argue that validation should be in collection, on the other hand this gives freedom
        var fieldIsRequired = (validators && validators['required']);
        var invalid = false; //Start off in a positive mood
    
        for (var key in validators)
          if (typeof(validators[key]) === 'function')
            if (fieldIsRequired)
              invalid = (validators[key](value))?invalid:2 //Error
            else
              invalid = (validators[key](value))?invalid:Math.max(1, invalid); //Warning

        temp.bindRecord.record(unifiedId, bindkey).invalid(invalid);
        temp.bindRecord.record(unifiedId, bindkey).required(fieldIsRequired);
      } else { //If data is not altered then we delete
        if (temp.bindRecord.get(unifiedId, bindkey)) {
          this.setDirtyMark(unifiedId, bindkey, '');  //DEPRECATE
        }
        temp.bindRecord.del(unifiedId, bindkey);
      } //EO no dirty record, delete
    } //EO objects to work with
  },
  isBindDirty: function(template, id, key) { /* key is optional */
    return (Template[template] && Template[template].bindRecord.isDirty(id, key) );
  },
  //DOM helper
  getBindInputValue: function(target) {
    return (target)?target.value:''; //TODO: Support more than INPUT
  },
  //DOM helper
  setBindInputvalue: function(target, value) {
    target.value = value;  //TODO: support more than INPUT
  },
  //DOM helper
  setDirtyMark: function(unifiedId, key, contents) {
    if (contents != undefined) {
      var domElement = document.getElementById('isBindDirty.'+unifiedId+'.'+key);
      if (domElement) domElement.innerHTML = contents;
    }
  },
  bindValidate: function(template, bindkey, unifiedId, value) {
    var temp = Template[template];
    var success = false;
    if (temp && bindkey && unifiedId) {
      var validator = (temp.validation)?temp.validation[bindkey]:undefined;
      if (validator) {
        success = true;
        for (var key in validator.validators)
          success = (validator.validators[key](value))?success:false;

        var domElement = document.getElementById('__bindMsg.'+unifiedId+'.'+bindkey);

        if (success) {

          if (domElement) domElement.innerHTML = (validator.successMessage)?validator.successMessage:'';

          if (temp.validationErrors[unifiedId] && temp.validationErrors[unifiedId][bindkey])
            delete temp.validationErrors[unifiedId][bindkey]; //clean up
          if (temp.validationErrors[unifiedId] && Object.keys(temp.validationErrors[unifiedId]).length===0)
            delete temp.validationErrors[unifiedId]; //No longer needed

        } else {

          if (domElement) domElement.innerHTML = (validator.errorMessage)?validator.errorMessage:'';

          if (!temp.validationErrors[unifiedId]) temp.validationErrors[unifiedId] = []; //Create
          temp.validationErrors[unifiedId][bindkey] = true; //There is an error

        } 
        //Set record validators message
        var domElementMain = document.getElementById('__bindMsg.'+unifiedId);
        if (temp.validationErrors[unifiedId])
          if (domElementMain) domElementMain.innerHTML = (temp.validation.errorMessage)?temp.validation.errorMessage:''
        else    
          if (domElementMain) domElementMain.innerHTML = (temp.validation.successMessage)?temp.validation.successMessage:'';

      }
    } //Objects to work with
    return success;
  },
  /*
  doBindAction gets called by binded template events on all likely bindAction events eg. input, button and a.btn for bootstrap

  @param template name as String
  @param data from event handler 'this', contains a getDataContext
  @param target event.target - node who triggered event
   */
  doBindAction: function(template, data, target) {
    //Valid bind actions:
    var validBindAction = {'create':true, 'update':true, 'delete':true, 'cancel':true};
    //bindAction=action id=unknown.action
    //bindAction=action id=id.name
    var bindAction = (target)?target.getAttribute('bindAction'):'';
    //id=id.name id=unknown.name or nothing?
    var bindId = (target)?target.getAttribute('id'):'';
    //Is it a cancel or create? or an exsting then check if ._id isset
    var isExistingRecord = (data._id)?true:false;
    //Set unified id
    var unifiedId = (isExistingRecord)?data._id:'unknown';
    //Check if this is a valid bindAction call else quit
    if (bindAction && validBindAction[bindAction]) {
      //Get the collection we are binded to
      var coll = this;
      //Get the template too
      var temp = Template[template];
      //Get elements from template
      var elements = temp.bindRecord[unifiedId];
      //Define carry object for most bindActions
      var newData = {};

      if (isExistingRecord) {
        //Valid actions is update, delete or cancel

        //## UPDATE RECORD
        if (bindAction=='update') {
          //Check if record is dirty if so then update
          if (this.isBindDirty(template, data._id)) {
            //We should have some dirty data to update
            for (var key in elements) { 
              var element = elements[key].node; //Get dirty nodes
              if (key != '_id' && element && this.getBindInputValue(element) != data[key]) //If data has changed
                newData[key] = this.getBindInputValue(element); //set new value 
            } //EO for
            if (Object.keys(newData).length != 0) //If data changed
              coll.update({_id: data._id}, { $set: newData}); //Update in database
          } //EO isBindDirty
        } //EO update

        //## DELETE RECORD
        if (bindAction=='delete') {
          //Just delete the record?
          coll.remove({ _id: data._id });
        } //EO delete

        //## UPDATE CANCEL
        if (bindAction=='cancel') {
          //reset the data
          for (var key in elements) { //Assume data keys allways valid WRONG...
            var element = elements[key].node; //Get dirty nodes
            if (key != '_id' && element) //Dont mess with _id
              if (data[key] != undefined && data[key] != null)
                this.setBindInputvalue(element, data[key]); //set old value
              //TODO: Support element value other than INPUT
          } //EO for 
        } //EO cancel
      } else {

        //## NEW CREATE
        //Valid actions is create or cancel
        if (bindAction == 'create') {
          //Create the record and empty the form
          if (this.isBindDirty(template, unifiedId)) {
            //We should have some dirty data to update
            for (var key in elements) { 
              var element = elements[key].node; //Get dirty nodes
              if (key != '_id' && element) {//If data
                newData[key] = this.getBindInputValue(element); //set new value 
                this.setBindInputvalue(element, ''); //Default?
                //TODO: Support elements value other than INPUT
              }
            } //EO for
            if (Object.keys(newData).length != 0) //If data changed
              coll.insert(newData); //Insert in database
          } //EO isBindDirty          
        } //EO create

        //## NEW CANCEL
        if (bindAction == 'cancel') {
          //Reset the data, go looking in the
          for (var key in elements) { //Assume data keys allways valid WRONG...
            var element = elements[key].node; //Get dirty nodes
            if (key != '_id' && element) //Dont mess with _id
              this.setBindInputvalue(element, ''); //set old value, should bind contain default?  eg, bind 'name' 'John'
          } //EO for 
        } //EO cancel
      }
      //Action handled on record - remove it from dirty record
      if (temp.dirtyMark != undefined && temp.dirtyMark != null)
        for (var key in elements) 
          this.setDirtyMark(unifiedId, key, '');
         
      delete Template[template].bindRecord[unifiedId];  //Delete from dirtyRecord, TODO: Test if 'delete elements;' would work

    } //EO valid bindAction
  } //EO doBindAction
  
});