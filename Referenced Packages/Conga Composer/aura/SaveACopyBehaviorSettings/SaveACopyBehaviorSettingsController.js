({
	handleSave : function(cmp, evt, helper) {
		if(cmp.get("v.isSaveACopy") && !helper.checkValidityAndFocus(cmp, "selectSaveACopy")) {return;}
		var option = cmp.get("v.saveACopyOptionSelected");
		if(option==="Files") {
			option = "SalesforceFile";
		} else if(option==="Notes & Attachments") {
			option = "Attachments";
		}
		helper.handleUpdateSaveACopySettings(cmp, evt, option);
	},
	init : function(cmp, evt, helper) {
		helper.callAction(cmp, cmp.get("c.getSaveACopySettings"), {
 			solutionId : cmp.get("v.solutionId")
 		}).then(function(returnVal) {
 			if(returnVal.length>0) {
 				cmp.set("v.isSaveACopy", true);
				if(returnVal[0].APXTConga4__Value__c==="SalesforceFile") {
					returnVal[0].APXTConga4__Value__c = "Files";
				} else if(returnVal[0].APXTConga4__Value__c==="Attachments") {
					returnVal[0].APXTConga4__Value__c = "Notes & Attachments";
				}
				cmp.set("v.saveACopyOptionSelected", returnVal[0].APXTConga4__Value__c);
 			} else {
 				cmp.set("v.isSaveACopy", false);
 				cmp.set("v.saveACopyOptionSelected", $A.get("$Label.apxtconga4.Save_A_Copy_Select_Salesforce_Chatter"));
 			}
	    });
	}
})