({
	init : function(cmp, e, helper) {
		helper.loadQueries(cmp, helper);
	},
	searchKeyChange: function(cmp, e, helper) {
        helper.searchKeyChange(cmp, e, helper);
    },
    searchResultClick : function(cmp, e, helper) {
    	var index = e.currentTarget.dataset.index;
    	var selectedItem = cmp.get("v.searchedItems")[index];
    	var resultClickEvent = cmp.getEvent("searchResultClickEvent");
    	resultClickEvent.setParams({message: JSON.stringify(selectedItem)}).fire();
    }
})