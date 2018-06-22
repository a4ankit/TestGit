({
	emailTemplateClick: function(cmp, e, helper) {
		cmp.getEvent("emailEvent").fire();
        helper.closeModal(cmp);
	},
	templateBuilderClick: function(cmp, e, helper) {
		cmp.getEvent("templateBuilderEvent").fire();
        helper.closeModal(cmp);
	}
})