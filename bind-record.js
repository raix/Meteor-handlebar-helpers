function BindRecord() {
  var self = this;
  self.records = [];
  self.listeners = {};
  //.set()
  self.record = function(unifiedId, bindkey) {
    getSetter = {};
    function initRecord(doCreate) {
      var records = self.records;
      //Init record
      if (records && unifiedId && !records[unifiedId])
        if (doCreate) records[unifiedId] = []
          else
        return {};
      //Init key
      if (records && unifiedId && records[unifiedId] && !records[unifiedId][bindkey])
        if (doCreate)
          records[unifiedId][bindkey] = {}
        else
          return {};
      if (doCreate) {
        /* Implement listener - Value just changed.. */
        for (var contextId in this.listeners)
          this.listeners[contextId].invalidate();
      } else {
        /* Implement listener - Value just read */
        var main = this;
        var context = Meteor.deps.Context.current;
        if (context && !this.listeners[context.id]) {
          this.listeners[context.id] = context;
          context.onInvalidate(function () {
            delete main.listeners[context.id];
          });
        } //EO Context
      }
      return records[unifiedId][bindkey];
    }

    getSetter.node = function(node) {
      if (node != undefined)
        return initRecord(true).node = node
      else
        return initRecord().node;
    };     
    getSetter.invalid = function(value) {
      if (value != undefined)
        return initRecord(true).invalid = value
      else
        return initRecord().invalid;
    };
    getSetter.required = function(isRequired) {
      if (isRequired != undefined)
        return initRecord(true).required = isRequired
      else
        return initRecord().required;
    };
    return getSetter;
  };
  self.isDirty = function(unifiedId, bindKey) { /* bindKey is optional */
    return (self.get(unifiedId) != undefined && (bindKey === undefined || self.get(unifiedId, bindKey) != undefined) );
  };
  //.get relative record data, if empty expect undefined
  self.get = function(unifiedId, bindKey, attribute) {
      var self = this;
      var records = self.bindRecord;
      var statusRecord = (records && unifiedId && records[unifiedId])? records[unifiedId]:undefined;
      var statusKey = (statusRecord && bindKey)? statusRecord[bindKey]:undefined;
      var statusAttribute = (statusKey && attribute)? statusKey[attribute]:undefined;

      /* Implement listener values read */
      var context = Meteor.deps.Context.current;
      var main = this;
      if (context && !this.listeners[context.id]) {
        this.listeners[context.id] = context;
        context.onInvalidate(function () {
          delete main.listeners[context.id];
        });
      } //EO Context

      if (unifiedId != undefined)
        if (bindKey != undefined)
          if (attribute != undefined)
            return statusAttribute
          else
            return statusKey
        else
          return statusRecord
      else
        return records;
  };
  //.del(unifiedId, [bindkey]) deletes record key and if last one then deletes the record for cleanup
  self.del = function(unifiedId, bindkey) {
    var self = this;
    if (unifiedId && self.records[unifiedId])           //If record exists then test bindkey
      if (bindkey && self.records[unifiedId][bindkey])  //If bindkey set and found then delete it
        delete self.records[unifiedId][bindkey];
    //If empty record or no bindkey then delete the whole record
    if (unifiedId && self.records[unifiedId] && (Object.keys(self.records[unifiedId]).length === 0 || !bindkey))
      delete self.records[unifiedId]; 

    /* Implement listeners, data just changed..  */
    for (var contextId in this.listeners)
      this.listeners[contextId].invalidate();
  }; 
}