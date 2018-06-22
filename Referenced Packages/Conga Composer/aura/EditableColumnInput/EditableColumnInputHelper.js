({
	checkValidityAndFocus: function(cmp,auraId) {
	    var input = cmp.find(auraId);
	    input.showHelpMessageIfInvalid();
	    return input.get("v.validity").valid;
	},
	fireCloseEditEvent : function(cmp) {
		cmp.getEvent("closeEditEvent").fire();
	}
})