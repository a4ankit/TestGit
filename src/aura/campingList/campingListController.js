({    // Load expenses from Salesforce
    doInit: function(component, event, helper) {
        
        // Create the action
        var req = component.get("c.getItems");
        
        // Add callback behavior for when response is received
        req.setCallback(this, function(response) {
            var state = response.getState();
            if (state == "SUCCESS") {
                component.set("v.items", response.getReturnValue());
            }
            else {
                console.log("Failed with state: " + state);
            }
        });
        
        // Send action off to be executed
        $A.enqueueAction(req);
    }
    ,
    handleAddItem:function(component, event, helper){
        var item = event.getParam("item");
        var act = component.get("c.saveItem");
        act.setParams({
            "item":item 
        });
        act.setCallback(this,function(response){
            if(response.getState=="SUCCESS"){
                var items = component.get("v.items");
                items.push(response.getReturnValue);
                component.set("v.items",items);
            }
        });
        $A.enqueueAction(act);
    }
})