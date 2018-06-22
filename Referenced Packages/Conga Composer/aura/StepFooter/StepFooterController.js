({
	accept: function(cmp, e, helper) {
    var event = cmp.getEvent("stepEvent");
    event.setParams({
	    eventAction: "stepForward"
	}).fire();
    
	},
	decline: function(cmp, e, helper) {
    var event = cmp.getEvent("stepEvent");
    event.setParams({
	    eventAction: "stepBack"
	}).fire();
    
	}
})