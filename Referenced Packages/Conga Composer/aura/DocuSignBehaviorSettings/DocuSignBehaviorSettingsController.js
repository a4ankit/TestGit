({
	handleSave : function(cmp, evt, helper) {
		var solutionId = cmp.get("v.solutionId");
		var recipients = cmp.get("v.DocuSignRecipients");
		helper.callAction(cmp, cmp.get("c.saveDocuSignParameters"),{
			solutionId : solutionId,
			solutionParametersJson: $A.util.json.encode(recipients) // SFDC lightning bug: can only pass JSON, not complex data structures (Array, Object), so must convert all complex data structures into JSON prior to passing to server
		}).then(function(returnVal) {
 			if(returnVal==="success") {
 				//Success
            } else {
            	cmp.getSuper().find('toastComponent').showToast($A.get("$Label.apxtconga4.Toast_Title"), errors, "error", "error");
            }
	    });
	}
})