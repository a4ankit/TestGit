({
	findByDocuSignerId : function(recipients, id) {
		for(var i = 0; i < recipients.length; i++) {
			if(recipients[i].SigningOrder == id){
				return recipients[i];
			}
		}
		return null;
	},
	initiateAndOpenModal: function(cmp, functionString, signingOrder, id, type, role) {
		var headerString = functionString + " Recipient";
		cmp.set("v.header", headerString);
		cmp.set("v.acceptLabel", functionString);
		cmp.set("v.signingOrder", signingOrder);
		cmp.set("v.recipientId", id);
		cmp.set("v.recipientType", type);
		cmp.set("v.recipientRole", role);
		this.openModal(cmp);
		window.setTimeout(
		    $A.getCallback(function() {
		    	cmp.find("recipientId").focus();
		    }), 1
		);
	},
	setRecipientValues: function(cmp, recipient, signingOrder) {
		recipient.SigningOrder = signingOrder;
		recipient.Id = cmp.get("v.recipientId");
		recipient.Type = cmp.get("v.recipientType");
		recipient.Role = cmp.get("v.recipientRole");
		return recipient;
	}
})