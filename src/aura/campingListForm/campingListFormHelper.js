({
    createItem : function(component,newItem) {
        var evt = component.getEvent("addItem");
        console.log(JSON.stringify(newItem));
        evt.setParams({
            "item":newItem 
        });
        evt.fire();
        component.set("v.newItem",{'sobjectType':'Camping_Item__c',
                                   'Name': '',
                                   'Quantity__c': 0,
                                   'Price__c': 0,
                                   'Packed__c': false});
    }
})