({
  SLDSPromise: function(fn) {
    // Specializes JS Promises to use Lightning $A.getCallback to safely handle async code in lightning
    var p = new Promise($A.getCallback(fn));
    var t = p.then;
    var c = p.catch;
    p.then = $A.getCallback(function() {
      return t.apply(p, arguments);
    });
    p.catch = $A.getCallback(function() {
      return c.apply(p, arguments);
    });

    return p;
  },
  callAction: function(action, params) {
    // Return a promise that calls an @AuraAction
    return this.SLDSPromise(function(resolve,reject) {
      if (params) action.setParams(params);
      action.setCallback(this, function(response) {
        var status = response.getState();
        if (status === "SUCCESS") {
          var val = response.getReturnValue();
          resolve(val);
        }
        else {
          var errors = response.getError();
          if (errors.length > 0) {
            errors = errors[0].message;
          }
          console.log(new Error(errors));
        }
      });
      $A.enqueueAction(action);
    });
  },
  createComponents: function(components) {
    // Return a promise that create components
    return this.SLDSPromise(function(resolve, reject) {
      $A.createComponents(components, function(components, status, message) {
        if (status == "SUCCESS") resolve(components);
        else console.log(message);
      });
    });
  },
  createComponent: function(type, options) {
    // Return a promise that create components
    return this.SLDSPromise(function(resolve, reject) {
      $A.createComponent(type, options, function(c,status,message) {
        if (status == "SUCCESS") resolve(c);
        else console.log(message);
      });
    });
  }
})