({
    doInit: function(component, event, helper) {
        
        // Create the action
        var action = component.get("c.accountListToDisplay");
        
        // Add callback behavior for when response is received
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.expenses", response.getReturnValue());
            }
            else {
                console.log("Failed with state: " + state);
            }
        });
        
        // Send action off to be executed
        $A.enqueueAction(action);
    },
    clickCreateItem : function(component, event, helper) {
        var newcamp = component.get("v.dev");
        console.log("newcamp"+newcamp);
        component.set("v.dev",component.get("v.name"));
    }
})