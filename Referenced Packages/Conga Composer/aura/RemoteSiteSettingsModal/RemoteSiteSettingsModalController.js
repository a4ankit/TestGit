({
	saveModal: function(cmp, e, helper) {
		helper.closeModal(cmp);
	},
	toggle : function(cmp, e, helper) {
		cmp.set("v.showDeets", !cmp.get("v.showDeets"));
		switch (cmp.get("v.showDeets")) {
			case true:
				cmp.set("v.toggleDetailText", "Hide Details");
				break;
			case false:
				cmp.set("v.toggleDetailText", "Show Details");
				break;
		}
	}, 
	// This saveModal function is overiding the same function from BaseModal
	saveModal : function(cmp, e, helper){
		// This event will bubble up to parent, QuickStartPackagesStepController
		var event = cmp.getEvent("stepEvent");
    	event.setParams({
	    	eventAction: "createRemoteSiteSettings"
		}).fire();
		
		helper.closeModal(cmp);
	}
})