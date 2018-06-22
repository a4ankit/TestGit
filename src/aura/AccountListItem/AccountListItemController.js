({
    accountSelected : function(component) {
        var event = $A.get("e.c:AccountSelected");
        event.setParams({"account": component.get("v.account")});
        event.fire();
    }
})