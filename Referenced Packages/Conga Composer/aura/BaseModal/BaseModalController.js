({
	closeModal: function(cmp, e, helper) {
		helper.closeModal(cmp, helper);
	},
	openModal: function(cmp, e, helper) {
		helper.openModal(cmp);
	},
	saveModal: function(cmp, e, helper) {
		cmp.getConcreteComponent().saveModal();
	}
})