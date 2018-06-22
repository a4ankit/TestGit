(function(w){
    "use strict"; //Optional because LC on LockerService active runs in strict mode

    var utilMethods = {
        "navigateTo":navigateTo,
        "compareName":compareName
    };

    function navigateTo(cmp, navigateTarget) {
        var theme = cmp.get("v.theme");
        window.location.assign('/apex/' + navigateTarget + '?theme=' + theme);
    } 

    function compareName(a, b) {
	  // Use toUpperCase() to ignore character casing
	  const nameA = a.Name.toUpperCase();
	  const nameB = b.Name.toUpperCase();

	  let comparison = 0;
	  if (nameA > nameB) {
	    comparison = 1;
	  } else if (nameA < nameB) {
	    comparison = -1;
	  }
	  return comparison;
	}

    w.lightningUtils = utilMethods;

})(window);