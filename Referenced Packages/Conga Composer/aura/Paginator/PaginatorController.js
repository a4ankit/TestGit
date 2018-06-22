({
	previousPage : function(component, event, helper) {
        var myEvent = $A.get("e.APXTConga4:PageChange");
        myEvent.setParams({ "direction": "previous"});
        myEvent.fire();
	},
	nextPage : function(component, event, helper) {
       var myEvent = $A.get("e.APXTConga4:PageChange");
        myEvent.setParams({ "direction": "next"});
        myEvent.fire();
	}
})