({
	onBlur: function(cmp, e, helper) {
		if(e.relatedTarget == null || !e.relatedTarget.parentElement.parentElement.parentElement.classList.contains('slds-dropdown')) {
			helper.toggleView(cmp, true);
		}
	},
	previewTemplate: function(cmp, e, helper) {
		helper.toggleView(cmp, true);
		helper.previewTemplate(e.currentTarget.id);
	},
	showView: function(cmp, e, helper) {
		helper.toggleView(cmp, false);
	}
})