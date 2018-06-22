({
	handleSave: function (cmp, evt, helper) {
		cmp.set("v.showSpinner", true);
		helper.callAction(cmp, cmp.get("c.saveEmailParameters"), {
			solutionId: cmp.get("v.solutionId"),
			toField: cmp.get("v.toField"),
			ccField: cmp.get("v.ccField"),
			bccField: cmp.get("v.bccField"),
			additionalToField: cmp.get("v.additionalToField")
		}).then(function (returnVal) {
			if(returnVal==="success") {
				//Success
			} else {
				cmp.getSuper().find('toastComponent').showToast($A.get("$Label.apxtconga4.Toast_Title"), errors, "error", "error");
			}
			cmp.set("v.showSpinner", false);
		});
	},
	init: function (cmp, evt, helper) {
		helper.initializeForm(cmp);
	}
})