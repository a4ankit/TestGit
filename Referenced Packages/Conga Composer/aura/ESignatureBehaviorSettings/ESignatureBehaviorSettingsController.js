({
    handleDocuSignSelected : function (cmp, evt, helper) {
    	if(evt.getParams().value) {
    		helper.createSignatureComponent(cmp, 'APXTConga4:DocuSignBehaviorSettings');
		}
    },
    handleOffSelected : function (cmp, evt, helper) {
    	if(evt.getParams().value) {
    		cmp.set("v.signatureForm", "");
		}
    },
    handleSave : function (cmp, evt, helper) {
    	var solutionId = cmp.get("v.solutionId");
    	helper.saveOffSelection(cmp, solutionId);
    },
    handleSignatureSelect : function(cmp, evt, helper) {
		var selectedSignature = evt.currentTarget.value;
		helper.setSelectedSignatureAttribute(cmp, helper, selectedSignature);
    },
    init : function(cmp, evt, helper) {
		helper.initializeForm(cmp, helper);
	}
})