({
	captureCloseEditEvent : function(cmp, e, helper) {
		cmp.set("v.isPopoverVisible", false);
		cmp.set("v.allowEdit", true);
	},
	onEditClick : function(cmp, e, helper) {
		if(cmp.get("v.allowEdit")) {
			cmp.set("v.isPopoverVisible", true);
			cmp.set("v.allowEdit", false);
		}
	}
})