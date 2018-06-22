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
  callAction: function(cmp, action, params) {
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

          //Hide any spinner
          cmp.set("v.showSpinner", false);
          //Show toast
          //Use cmp.getSuper here because only child components to BaseStep will be passing in themselves to callAction.
          //Use getSuper.getSuper... to dig even deeper
          //TODO: make this suck a little less
          var toastComponent = cmp.getSuper().find('toastComponent');
          if (typeof toastComponent == "undefined") {
            toastComponent = cmp.getSuper().getSuper().find('toastComponent');
          }
          if (typeof toastComponent == "undefined") {
            toastComponent = cmp.getSuper().getSuper().getSuper().find('toastComponent');
          }
          toastComponent.showToast($A.get("$Label.apxtconga4.Toast_Title"), errors, "error", "error");
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
  },
  navigatePrevNext : function(cmp, isNext) {
    var steps = cmp.get("v.steps");
    var index = cmp.get("v.index");
    var i = isNext ? 1 : -1;
    if (index > -1 && steps[index+i]) {
      this.navigateIndex(cmp, index+i);
    }
  },
  navigateIndex: function(cmp, index) {
    var steps = cmp.get("v.steps");
    var showing = steps[index];
    var type = showing.type;
    var options = {};
    
    var masterObject = cmp.get("v.masterObject");
    var masterObjectLabel = cmp.get("v.masterObjectLabel");
    var solutionId = cmp.get("v.solutionId");
    var solutionName = cmp.get("v.solutionName");
    var theme = cmp.get("v.theme");
    var inVFPage = cmp.get("v.inVFPage");
        	
    window.location.assign('/apex/'+type.replace('c:','')+'?mo='+masterObject+'&mol='+masterObjectLabel+'&sid='+solutionId+'&sn='+solutionName+'&theme='+theme);

  },
    handleErrors : function(response, cmp) {
      
      this.showToast(cmp, response);
    },
    showToast : function(cmp, message) {
      //Show toast
      var toastComponent = cmp.find('toastComponent');
      toastComponent.showToast($A.get("$Label.apxtconga4.Toast_Title"), message, "error", "error");
    },  
  checkValidityAndFocus: function(cmp,auraId) {
    widget = cmp.find(auraId)
    widget.showHelpMessageIfInvalid()
    return widget.get("v.validity").valid
  }
})