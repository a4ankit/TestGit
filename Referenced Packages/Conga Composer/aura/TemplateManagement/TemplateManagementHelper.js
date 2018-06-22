({
	checkTemplateMaxReached: function(cmp) {
		var templates = cmp.find("lightningTableTemplates").get("v.latestRecords");
		var isTemplateMaxReached = false;
		if(templates.length >= 10) {
			isTemplateMaxReached = true;
		}
		cmp.set("v.templateMaxReached", isTemplateMaxReached);
	},
	getTemplatesFromTable: function(cmp) {
		return cmp.find("lightningTableTemplates").retrieveTemplates();
	},
	hideSpinner : function(cmp) {
		cmp.set("v.showSpinner", false);
	},
	saveTemplates: function(cmp, baseHelper, callback) {
		var templates = this.getTemplatesFromTable(cmp);
		
		baseHelper.callAction(cmp, cmp.get("c.saveSolutionTemplates"), {
			solutionId: cmp.get("v.solutionId"),
			templateIds: templates
		}).then(callback);
	},
	showSpinner : function(cmp) {
		cmp.set("v.showSpinner", true);
	}
})