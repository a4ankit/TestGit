({
	callAction: function (action, params, callback) {
        if (params) action.setParams(params);
        action.setCallback(this,callback);
        $A.enqueueAction(action);
	},
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
    }
})