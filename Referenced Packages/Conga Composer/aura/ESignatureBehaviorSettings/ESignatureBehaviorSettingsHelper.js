({
	clearSignatureSelections: function (cmp) {
		cmp.set("v.isOffSelected", false);
		cmp.set("v.isDocuSignSelected", false);
	},
	createSignatureComponent: function (cmp, selectedComponent) {
		var solutionId = cmp.get("v.solutionId");
		var currentForm = cmp.get("v.signatureForm");
		if(currentForm.length == 0 || (currentForm.length == 1 && currentForm[0].type != selectedComponent)) {	
			$A.createComponent(
				selectedComponent,
				{
					"solutionId": solutionId
				},
				function(newCmp){
					if (cmp.isValid()) {
						cmp.set("v.signatureForm", newCmp);
					}
				}
			);
		}
	},
	initializeForm : function (cmp, helper) {
		var solutionId = cmp.get("v.solutionId");
		this.callAction(cmp, cmp.get("c.getESignatureSelected"),
		{ solutionId : solutionId })
		.then(function(returnVal) {
			helper.setSelectedSignatureAttribute(cmp, helper, returnVal);
        });
	},
	saveOffSelection: function(cmp, solutionId) {
		this.callAction(cmp, cmp.get("c.saveOffSetting"),
		{ solutionId : solutionId })
		.then(function(returnVal) {
			if(returnVal=='success') {
				//Success
			}
			else {
				cmp.getSuper().find('toastComponent').showToast($A.get("$Label.apxtconga4.Toast_Title"), errors, "error", "error");
			}
        });
	},
	setSelectedSignatureAttribute: function (cmp, helper, selectedSignature) {
		helper.clearSignatureSelections(cmp);
		if(selectedSignature == "off") {
        	cmp.set("v.isOffSelected", true);
        	return;
        }
        else if(selectedSignature == "docuSign") {
        	cmp.set("v.isDocuSignSelected", true);
        	return;
        }
	}
})