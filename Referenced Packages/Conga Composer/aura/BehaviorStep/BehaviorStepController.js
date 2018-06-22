({
	handleBehaviorSelect : function(cmp, evt) {
		var solutionId = cmp.get("v.solutionId");
		var componentRequested = evt.getParam("message");
		var currentBehavior = cmp.get("v.behaviorArea");
		if(currentBehavior.length == 0 || (currentBehavior.length == 1 && currentBehavior[0].type != componentRequested)) {
			$A.createComponent(
				componentRequested,
				{
					"solutionId": solutionId
				},
				function(newCmp) {
					if(cmp.isValid()) {
						cmp.set("v.behaviorArea", newCmp);
					}
				}
			);
		}
	},
	handleBehaviorSave : function(cmp, evt) {
		cmp.set("v.behaviorArea", "");
	}
})