({
	addRecipient : function(cmp, evt, helper) {
		helper.initiateAndOpenModal(cmp, "Add", "", "", "", "");
	},
	editRecipient : function(cmp, evt, helper) {		
		var params = evt.getParam('arguments');
		var recipients = cmp.get("v.DocuSignRecipients");
		var recipientToEdit = helper.findByDocuSignerId(recipients, params.idToEdit);
		helper.initiateAndOpenModal(cmp, "Edit", recipientToEdit.SigningOrder, recipientToEdit.Id, recipientToEdit.Type, recipientToEdit.Role);
	},
	saveRecipient : function(cmp, evt, helper) {
		var existingRecipients = cmp.get("v.DocuSignRecipients");
		var recipientId = cmp.get("v.recipientId");
		var signingOrder = cmp.get("v.signingOrder");
		var recipientType = cmp.get("v.recipientType");
		var recipientRole = cmp.get("v.recipientRole");
		// validate user input
		if(recipientId && recipientType && recipientRole) {
			if(signingOrder == "") {
				signingOrder = existingRecipients.length + 1;
				var newRecipient = {};
				newRecipient = helper.setRecipientValues(cmp, newRecipient, signingOrder);
				existingRecipients.push(newRecipient);
			} else {
				var index = signingOrder - 1;
				var exisingRecipient = existingRecipients[index];
				helper.setRecipientValues(cmp, exisingRecipient, signingOrder);
			}
			cmp.set("v.DocuSignRecipients", existingRecipients);
			helper.closeModal(cmp);
		}
	}
})