({
	searchKeyChange: function(cmp, event, helper) {
		cmp.set("v.enabled", true);
		cmp.set("v.sampleRecordId", "");
		helper.searchKeyChange(cmp, event, helper);
	}
})