({
	handleFinishedAddTemplates: function(cmp, event, helper) {
		helper.showSpinner(cmp);
		// save the APXTConga4__Conga_Template__c record
        helper.callAction(cmp, cmp.get("c.saveCongaTemplate"), {
        	solutionId: cmp.get("v.solutionId"),
        	templateName: "Wizard Generated Template",
        	templateGroup: "",
        	templateDescription: ""
        }).then(function(returnVal) {
        	// save the ContentVersion record
        	if(returnVal) {
	    		helper.callAction(cmp, cmp.get("c.saveTheDocument"), {
	                fileName: cmp.get("v.fileType"),
	                base64Data: cmp.get("v.base64String"),
	                congaTemplateId: returnVal
	    		}).then(function(returnVal) {
	    			helper.hideSpinner(cmp);
	    			window.location.assign('/apex/TemplateStep?mo='+cmp.get("v.masterObject")+'&sid='+cmp.get("v.solutionId")+'&sn='+cmp.get("v.solutionName")+'&theme='+cmp.get("v.theme"));
	    		});
    		}
        });
    },
    handleSaveDocReplacements: function(cmp, event, helper) {
    	// method saveDocReplacements() receives the base64 string representation of the pdf document and returns the base64 string representation of the doxc document
    	helper.showSpinner(cmp);
        helper.callAction(cmp, cmp.get("c.saveDocReplacements"), {
        	replacementsJson: $A.util.json.encode(cmp.get("v.templateMergeFieldArr")),
        	originalDocumentAsBase64: cmp.get("v.base64String")
        }).then(function(returnVal) {
        	var responseObj = JSON.parse(returnVal);
			var json = $A.util.json.encode(responseObj.results[0]);
			var regex = new RegExp('"', "g");
			json = json.replace(regex, "");
			cmp.set("v.base64String", json);
			cmp.find("TemplateBuilder").publicHandleLoadDocument();
			cmp.set("v.templateMergeFieldArr", []);
			helper.hideSpinner(cmp);
        });
    },
    handleTemplateUpload: function(cmp, e, helper) {
    	cmp.set("v.isTemplateUploaded", true);
    }
})