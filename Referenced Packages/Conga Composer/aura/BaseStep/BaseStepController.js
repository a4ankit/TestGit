({
	init : function(cmp, e, helper) {
		
	},
  captureNavigationEvent: function(cmp, e, helper) {

    switch(e.getParam("eventAction")) {
      case "stepForward":
      helper.navigatePrevNext(cmp, true);
      break;
      case "stepBack":
      helper.navigatePrevNext(cmp, false);
      break;
      default:

    }
    
  },
  jump: function(cmp, e, helper) {
	//If the solution has been created, allow to navigate. Otherwise don't allow.
	var solutionId = cmp.get("v.solutionId");
	if (solutionId != '' && typeof solutionId != "undefined") {
	  var target = e.target;
	  var index = target.getAttribute("data-step");
	  if (index && index.length > 0) {
	    helper.navigateIndex(cmp, parseInt(index));
	  }
	}
  }
})