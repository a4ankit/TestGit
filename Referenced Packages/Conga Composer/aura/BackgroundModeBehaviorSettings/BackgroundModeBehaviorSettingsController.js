({
	handleSave : function(cmp, evt, helper) {
		helper.handleUpdateBackgroundModeSettings(cmp, evt, cmp.get("v.backgroundModeOptionSelected"));
	},
	init : function(cmp, evt, helper) {
		helper.callAction(cmp, cmp.get("c.getBackgroundModeSettings"), {
 			solutionId : cmp.get("v.solutionId")
 		}).then(function(returnVal) {
 			if(returnVal.length>0) {
				cmp.set("v.isBackgroundMode", true);
				cmp.set("v.backgroundModeOptionSelected", returnVal[0].APXTConga4__Value__c);
 			} else {
 				cmp.set("v.isBackgroundMode", false);
 				cmp.set("v.backgroundModeOptionSelected", "1");
 			}
	    });
	}
})