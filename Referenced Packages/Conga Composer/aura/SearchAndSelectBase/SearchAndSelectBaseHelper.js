({
	searchKeyChange: function (cmp, event, helper) {
		cmp.find("searchInput").showHelpMessageIfInvalid();
		var searchStr = event.target.value.toLowerCase();
		cmp.set("v.searchStr", searchStr);
		if(searchStr) {
			var tempArr = [];
			var itemsArr = cmp.get("v.items");
			var re = new RegExp(searchStr.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\\\$&"), "gi");
			for(var i=0; i<itemsArr.length; i++) {
				// enumerate all object properties (except for Id) and look for match
				for(var field in itemsArr[i]) {
					if(!field.match(/Id/i) && itemsArr[i][field].match(re)) {
						tempArr.push(itemsArr[i]);
						break;
					}
				}
			}
			if(tempArr.length>0) {
				if("Name" in tempArr[0]) {
					tempArr.sort(lightningUtils.compareName);
				}
			}
			cmp.set("v.searchedItems", tempArr.slice(0, cmp.get("v.itemsToShow")));
			cmp.set("v.showItems", true);
		} else {
			cmp.set("v.searchedItems", []);
			cmp.set("v.showItems", false);
		}
	}
})