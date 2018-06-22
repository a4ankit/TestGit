({
	init : function(cmp, evt, helper) {		
		cmp.getSuper().set("v.showSpinner", true);
		var solutionId = cmp.get("v.solutionId");
		helper.callAction(cmp, cmp.get("c.getDocuSignRecipients"), {
 			solutionId : solutionId
 		}).then(function(returnVal) {
			cmp.set("v.DocuSignRecipients", returnVal);
			cmp.getSuper().set("v.showSpinner", false);
	    });
	},
	handleAddRecipient : function(cmp, evt, helper) {
		var recipients = cmp.get("v.DocuSignRecipients");
		var addRecipientModal = cmp.find("addRecipientModal");
		addRecipientModal.openAddModal();
	},
	handleSelect : function (cmp, evt, helper) {
		var selectedMenuItemValue = evt.getParam("value");
		var selectedRowIndex = evt.getSource().get("v.value");
		var recipients = cmp.get("v.DocuSignRecipients");
		if(selectedMenuItemValue == "Edit") {
			var addRecipientModal = cmp.find("addRecipientModal");
			addRecipientModal.openEditModal(selectedRowIndex);
		}
		else if (selectedMenuItemValue == "Delete") {
			helper.deleteRecipient(cmp, selectedRowIndex, recipients);
		}
	},
	hideTooltip : function(cmp, evt, helper) {
		cmp.set("v.toolTipIsShown", false);
	},
	showTooltip : function(cmp, evt, helper) {
		cmp.set("v.toolTipIsShown", true);
	}
})