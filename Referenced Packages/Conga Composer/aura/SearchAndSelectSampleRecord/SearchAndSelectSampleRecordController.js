({
	hideSampleRecords: function(cmp, event, helper) {
		helper.hideAll(cmp, event, helper);
	},
	init: function(cmp, event, helper) {
		helper.loadSampleRecords(cmp, event, helper);
		cmp.set("v.itemsToShow", 10);
	},
	selectThisRecord: function(cmp, event, helper) {
		cmp.set("v.searchStr", event.currentTarget.title);
		cmp.set("v.sampleRecordId", event.currentTarget.id);
		helper.hideAll(cmp, event, helper);
	}
})