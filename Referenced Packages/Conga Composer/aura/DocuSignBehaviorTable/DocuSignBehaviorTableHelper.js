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
				}
			});
			$A.enqueueAction(action);
		});
  	},
	editRecipient : function (editModal, id, recipients) {
		var recipientToEdit = this.findByDocuSignerId(recipients, id);
		editModal.set();
	},
	deleteRecipient : function (cmp, id, recipients) {
		var indexToRemove = null;
		for(var i=0; i<recipients.length; i++) {
			if(recipients[i].SigningOrder == id){
				indexToRemove = i;
			}
			else if(recipients[i].SigningOrder > id) {
				recipients[i].SigningOrder--;
			}
		}
		if (indexToRemove != null) {
			recipients.splice(indexToRemove,1);
		}
		cmp.set("v.DocuSignRecipients", recipients);
	}
})