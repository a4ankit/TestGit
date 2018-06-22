({
	addQuery: function(cmp, query) {
		var newQuery = JSON.parse(query);
		var rows = cmp.get("v.queryData");
		rows.push(newQuery);
		cmp.set("v.queryData", rows);
	},
	clearErrors: function(cmp) {
		cmp.set("v.errorMessage", "");
	},
	getQueryParameters: function(cmp) {
	
		var queries = cmp.get("v.queryData");
		var ids = [];
		var aliases = [];
		
		for(var i = 0; i < queries.length; i++) {
			var alias = queries[i].Alias ? queries[i].Alias : '';
			ids.push(queries[i].Id);
			aliases.push(alias);
		}
		
		var parameters = {
			solutionId: cmp.get("v.solutionId"),
			queryIds: ids,
			queryAliases: aliases
		}
		
		return parameters;
	},
	openCreateQuery : function(queryPrefix) {
        window.open('/' + queryPrefix + '/e', '_blank');
    },
	stepForward: function(cmp) {
		var event = cmp.getEvent("stepEvent");
		event.setParams({
			eventAction: "stepForward"
		}).fire();
	}
})