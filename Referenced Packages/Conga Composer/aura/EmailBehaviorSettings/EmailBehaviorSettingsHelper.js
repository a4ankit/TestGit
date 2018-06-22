({
	initializeForm : function (cmp) {
		cmp.set("v.showSpinner", true);
		this.callAction(cmp, cmp.get("c.getEmailParameters"),{
			solutionId : cmp.get("v.solutionId")
		}).then(function(returnVal) {
			cmp.set("v.toField", returnVal.ToField);         
            cmp.set("v.ccField", returnVal.CcField);
            cmp.set("v.bccField", returnVal.BccField);
            cmp.set("v.additionalToField", returnVal.AdditionalToField);
            cmp.set("v.showSpinner", false);
        });
	}
})