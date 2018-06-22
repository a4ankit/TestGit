({
	findByName: function(component,event) {  
        var searchKey = event.getParam("searchKey");
        var locationList = component.get("v.AccountList");
        var action = component.get("c.findByName");
        
        action.setParams({
            "searchKey": searchKey,
            "AccountList" : AccountList
        }); 
        action.setCallback(this, function(a) {
            component.set("v.AccountList", a.getReturnValue());
            //component.set("v.accountsLength", a.getReturnValue().length); 
        });
        $A.enqueueAction(action);
    },
})