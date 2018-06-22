({
    doInit : function(component, event, helper) {
        var action = component.get("c.getSimilarProperties");
        action.setParams({
            recordId: component.get("v.recordId"),
            beds: component.get("v.property.fields.Beds__c.value"),
            price: component.get("v.property.fields.Price__c.value")
        });
        action.setCallback(this, function(response){
            var similarProperties = response.getReturnValue();
            component.set("v.similarProperties", similarProperties);
        });
        $A.enqueueAction(action);
    }
})