({
    loadQueries : function(cmp, helper) {
        helper.callAction(cmp, cmp.get("c.getAllQueries"),
        {}
        ).then(function(returnVal) {
            cmp.set("v.items", returnVal);
        });
    },
    searchKeyChange: function(cmp, e, helper) {
        cmp.find('searchInput').showHelpMessageIfInvalid();

		var searchStr = e.target.value.toLowerCase();
		cmp.set("v.searchStr", searchStr);
		
		if(searchStr.length == 0) {
			cmp.set("v.searchedItems", []);
			cmp.set("v.showItems", false);
			return;
		}
		
        var returnStrArray = [];
        for (var i = 0, l = cmp.get("v.items").length; i < l; i++) {
            var obj = cmp.get("v.items")[i];
            if (JSON.stringify(obj).toLowerCase().includes(searchStr)){
              returnStrArray.push(obj);
            }
        }
        
        if (returnStrArray.length > 0) {
            //If the objects in the array have a Name property
            if ('Name' in returnStrArray[0]) {
                //Sort alphabetically by Name
                returnStrArray.sort(lightningUtils.compareName);
            }
        }
        //Only show x number of results in the result pane
        cmp.set("v.searchedItems", returnStrArray.slice(0, cmp.get("v.itemsToShow")));
        //Show the result pane
        cmp.set("v.showItems", true);
    }
})