({
	deleteRecord: function(cmp, e, helper) {
		helper.showSpinner(cmp);
		helper.removeTableRow(e.currentTarget.value, cmp);
		cmp.getEvent("templateDeleteEvent").fire();
		helper.hideSpinner(cmp);
	},
	hideAll: function(cmp, e, helper) {
		helper.hideAll(cmp);
    },
    jqueryLoaded : function (cmp, e, helper) {
    	var el = cmp.find("templateTableBody").getElement();
    	$(el).sortable({
    		cursor: "move",
    		axis: "y",
    		handle: ".dragColumn",
    		containment: "parent"
    	});
    },
    retrieveTemplates : function (cmp, e, helper) {
    	var el = cmp.find("templateTableBody").getElement();
    	var rows = $(el).find('tr');
    	var templates = [];
    	$.each(rows, function (i, val) {
    		templates.push(val.dataset.templateid);
    	});
    	
    	return templates;
    }
})