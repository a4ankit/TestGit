({
	closeModal : function(cmp, helper) {
		cmp.set("v.isModalVisible", false);
	},
	openModal : function(cmp) {
		cmp.set("v.isModalVisible", true);
	}
})