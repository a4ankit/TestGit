({
	handleSave: function (cmp, evt, helper) {
		if(!helper.checkValidityAndFocus(cmp, "subject")) {
			return
		}
		if(!helper.checkValidityAndFocus(cmp, "days")) {
			return
		}
		dto = {
			logActivity: cmp.get("v.logActivity"), 
			subject: cmp.get("v.subject"),
			days: cmp.get("v.days")
		};
		daysOrNull = ($A.util.isEmpty(dto.days) ? null : dto.days);
		// from the DTO, specify desired state of database in the form of a Map<string k, string v> 
		//  where k is the parameter name, v the desired value. 
		//  From this the apex saveParameters will generate the necessary create/insert/update/delete SOQL statements.
		//  DB desired values must be strings or null. No automatic conversions. Null value means delete this parameter.
		dbops = {
			AC0: dto.logActivity ? "1" : null,
			AC1: dto.logActivity ? (dto.subject ? dto.subject : null) : null, // subject may be undefined if it was omitted on input.  
			AC3: dto.logActivity ? daysOrNull : null
		};
		cmp.set("v.showSpinner", true);
		helper.callAction(cmp, cmp.get("c.saveParameters"), {
			solutionId: cmp.get("v.solutionId"),
			parameters: dbops
		}).then(function(returnVal) {
 			if(returnVal==="success") {
 				//Success
            } else {
            	cmp.getSuper().find('toastComponent').showToast($A.get("$Label.apxtconga4.Toast_Title"), response.getError(), "error", "error");
            }
 			cmp.set("v.showSpinner", false);
	    });
	},
	init: function (cmp, evt, helper) {
		cmp.set("v.showSpinner", true);
		helper.callAction(cmp, cmp.get("c.getParameters"), {
			solutionId: cmp.get("v.solutionId")
		}).then(function (dto) {
			cmp.set("v.logActivity", dto.AC0 == 1);
			cmp.set("v.subject", dto.AC1);
			cmp.set("v.days", dto.AC3);
			cmp.set("v.showSpinner", false);
		});
	}
})