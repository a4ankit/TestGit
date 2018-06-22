({
	addRecord : function (cmp, e, helper) {
		var newRow = e.getParam("arguments").rowData;
		var rows = cmp.get("v.latestRecords");
		rows.push(newRow);
		cmp.set("v.latestRecords", rows);
	},
	doInit : function(component, event, helper) {
        helper.getsObjectRecords(component, 1, helper);
	},
    pageChange: function(component, event, helper) {
         var page = component.get("v.page") || 1;
         var direction = event.getParam("direction");
         page = direction === "previous" ? (page - 1) : (page + 1);
         helper.getsObjectRecords(component,page, helper);
    }
})