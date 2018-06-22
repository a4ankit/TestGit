({
	callAction: function(cmp, action, params) {
  		// return a promise that calls an @AuraAction
		return this.SLDSPromise(function(resolve,reject) {
			if(params) action.setParams(params);
			cmp.set("v.showSpinner", true);
			action.setCallback(this, function(response) {
				if(response.getState() === "SUCCESS") {
					resolve(response.getReturnValue());
				} else {
					var errors = response.getError();
					if(errors.length > 0) {
						errors = errors[0].message;
					}
					cmp.getSuper().find('toastComponent').showToast($A.get("$Label.apxtconga4.Toast_Title"), errors, "error", "error");
				}
				cmp.set("v.showSpinner", false);
			});
			$A.enqueueAction(action);
		});
  	},
	checkValidityAndFocus: function(cmp,auraId) {
		widget = cmp.find(auraId);
		widget.showHelpMessageIfInvalid();
		return widget.get("v.validity").valid;
	},
	handleUpdateBackgroundModeSettings : function(cmp, evt, solutionParameters) {
		if(cmp.get("v.isBackgroundMode") && !this.checkValidityAndFocus(cmp,"selectBackgroundMode")) {return;}
		this.callAction(cmp, cmp.get("c.updateBackgroundModeSettings"), {
 			solutionId : cmp.get("v.solutionId"),
 			solutionParameters : solutionParameters,
 			isBackgroundMode : cmp.get("v.isBackgroundMode")
 		}).then(function(returnVal) {
 			if(returnVal==="success") {
 				//Success
            } else {
            	cmp.getSuper().find('toastComponent').showToast($A.get("$Label.apxtconga4.Toast_Title"), response.getError(), "error", "error");
            }
	    });
	},
	SLDSPromise: function(fn) {
		// specializes JS Promises to use Lightning $A.getCallback to safely handle async code in lightning
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
	}
})