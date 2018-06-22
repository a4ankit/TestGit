({
	handleSave : function(cmp, evt, helper) {
		var filenameElement = cmp.find("filenameField");
		var filenameValidity = filenameElement.get("v.validity");
		if(!filenameValidity.valid) {
			filenameElement.focus();
			return;
		}
		var convertToPdfValue = "";
		if(cmp.get("v.convertToPdf")) {
			convertToPdfValue = "1";
		}
		var isMandatoryValue = "";
		if(cmp.get("v.isMandatory")) {
			isMandatoryValue = "1";
		}
		var filename = cmp.get("v.filename");
		if(filename != null) {
			filename = encodeURI(filename);
		}
		cmp.set("v.showSpinner", true);
		helper.callAction(cmp, cmp.get("c.saveFileSettingParameters"), {
			solutionId : cmp.get("v.solutionId"),
    		convertToPdfValue : convertToPdfValue, 
    		isMandatoryValue : isMandatoryValue,
    		filenameField : filename }
		).then(function(returnVal) {
 			if(returnVal==="success") {
 				//Success
            } else {
            	cmp.getSuper().find('toastComponent').showToast($A.get("$Label.apxtconga4.Toast_Title"), response.getError(), "error", "error");
            }
 			cmp.set("v.showSpinner", false);
	    });
	},
	init : function(cmp, evt, helper) {
		helper.initializeForm(cmp, helper);
	}
})