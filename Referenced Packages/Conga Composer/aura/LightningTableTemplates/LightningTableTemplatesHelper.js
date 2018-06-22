({
    getsObjectRecords : function(cmp,page,helper) {
        var action = cmp.get("c.getSolutionTemplates");
        
        var params = {
            solutionId : cmp.get("v.solutionId"),
        };
        var callback = function(response){
            var state = response.getState();
            if(state === 'SUCCESS'){               
                cmp.set("v.latestRecords",response.getReturnValue());
                cmp.getEvent("tableLoadedEvent").fire();
             }else if (state === "ERROR") {
                console.log('Error');
            }
        };
        
        this.callAction(action, params, callback);
    },
    hideAll: function(cmp) {
        var ddDiv = cmp.find('ddm');
        if (typeof ddDiv !== "undefined"){
            for(var i = 0; i<ddDiv.length; i++) {
                ddDiv[i].set("v.hide", true);
            }
        }
    },
    hideSpinner : function(cmp){
        var spinnerEvent = cmp.getEvent("spinnerEvent");
        spinnerEvent.setParams({eventAction: "hideSpinner"}).fire();
    },
    removeTableRow : function (rowIndexToRemove, cmp) {
		var rows = cmp.get("v.latestRecords");
		rows.splice(rowIndexToRemove, 1);
		cmp.set("v.latestRecords", rows);
	},
    showSpinner: function(cmp) {
        var spinnerEvent = cmp.getEvent("spinnerEvent");
        spinnerEvent.setParams({eventAction: "showSpinner"}).fire();
    }
})