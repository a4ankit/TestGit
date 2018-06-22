({
	captureSearchResultClickEvent: function(cmp, e, helper) {
		helper.addQuery(cmp, e.getParams().message);
	},
	createQueryClick: function (cmp, e, helper) {
		var queryPrefix = cmp.get("v.queryObjectPrefix");
		helper.openCreateQuery(queryPrefix);
	},
	onInit: function(cmp, e, helper) {
		helper.callAction(cmp, cmp.get("c.getSolutionQueries"), {
			solutionId: cmp.get("v.solutionId")
		}).then(function (returnVal) {
			cmp.set("v.queryData", returnVal);
		});
		
		helper.callAction(cmp, cmp.get("c.getCongaQueryPrefix"), {})
		.then(function (returnVal) {
			cmp.set("v.queryObjectPrefix", returnVal);
		});
	},
	saveQueries: function(cmp, e, helper) {
		helper.clearErrors(cmp);
		var parameters = helper.getQueryParameters(cmp);
		helper.callAction(cmp, cmp.get("c.saveSolutionQueries"), parameters)
		.then(function (returnVal) {
			if(returnVal==="success") {
 				helper.stepForward(cmp);
            } else {
            	cmp.set("v.errorMessage", returnVal);
            }
		});
	}
})