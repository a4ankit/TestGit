({
	handleCreateComponent: function(cmp, event, componentName) {
		cmp.set("v.showSpinner", true);
        $A.createComponent(
    		componentName,
    		{
    			"solutionId": cmp.get("v.solutionId"),
	    		"masterObject": cmp.get("v.masterObject"),
	    		"masterObjectLabel": cmp.get("v.masterObjectLabel")
        	},
            function(newCmp) {
                if(cmp.isValid()) {
                    cmp.set("v.body", newCmp);
                }
                cmp.set("v.showSpinner", false);
            }
        );
    }
})