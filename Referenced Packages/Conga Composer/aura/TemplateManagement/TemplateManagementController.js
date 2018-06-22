({
	captureSpinnerEvent: function (cmp, e, helper) {
		switch (e.getParam("eventAction")) {
			case "showSpinner":
				helper.showSpinner(cmp);
				break;
			case "hideSpinner":
				helper.hideSpinner(cmp);
				break;
			default:
				helper.hideSpinner(cmp);
		}
	},
	captureAddTemplateEvent: function (cmp, e, helper) {
		helper.showSpinner(cmp);
		var newTemplate = JSON.parse(e.getParams().message);
		cmp.find("lightningTableTemplates").addRecord(newTemplate);
		helper.checkTemplateMaxReached(cmp);
		helper.hideSpinner(cmp);
	},
	captureTableLoadedEvent: function (cmp, e, helper) {
		helper.checkTemplateMaxReached(cmp);
	},
	captureTemplateDeleteEvent: function (cmp, e, helper) {
		helper.checkTemplateMaxReached(cmp);
	},
	createTemplateClick: function (cmp, e, helper) {
		var templates = helper.getTemplatesFromTable(cmp);
		helper.saveTemplates(cmp, helper, 
		function (returnVal) {
			if(returnVal==="success") {
				cmp.getEvent("templateBuilderEvent").fire();
            } else {
            	cmp.getSuper().find('toastComponent').showToast($A.get("$Label.apxtconga4.Toast_Title"), response.getError(), "error", "error");
            }
		});
	},
	saveTemplates: function (cmp, e, helper) {
		helper.saveTemplates(cmp, helper, 
		function (returnVal) {
			if(returnVal==="success") {
 				var event = cmp.getEvent("stepEvent");
 				event.setParams({
 					eventAction: "stepForward"
 				}).fire();
            } else {
            	cmp.getSuper().find('toastComponent').showToast($A.get("$Label.apxtconga4.Toast_Title"), response.getError(), "error", "error");
            }
		});
	},
	uploadTemplateClick: function (cmp, e, helper) {
		cmp.find("uploadTemplateModal").openModal();
	}
})