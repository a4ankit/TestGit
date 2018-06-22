({
	myAction : function(component, event, helper) 
	{ 
		component.set("v.Columns", [
			{label:"Account Name", fieldName:"Name", type:"text", sortable:"true", editable:'true'},
			{label:"Phone", fieldName:"Phone", type:"Number",sortable:"true"},
			{label:"AccountNumber", fieldName:"AccountNumber", type:"text", sortable:"true"},
			{label:"Billing City", fieldName:"BillingCity", type:"text", sortable:"true"},
			{label:"Website", fieldName:"Site", type:"text", sortable:"true"},
			]);
		var action = component.get("c.getPopAccounts");
		// Add callback behavior for when response is received
		action.setCallback(this, function(response) {
			var state = response.getState();
			if (state === "SUCCESS") {
				component.set("v.AccountList", response.getReturnValue());
				// console.log(JSON.stringify(response.getReturnValue()));
			}
			else {
				console.log("Failed with state : " + state);
			}
		});

		var populatepicklists = component.get("c.getselectOptions");
		var inputsel = component.find("Activity");
		var options = [];     

		populatepicklists.setCallback(this, function(a) {
			for(var i=0;i< a.getReturnValue().length;i++){
				options.push({"class": "optionClass", label: a.getReturnValue()[i], value: a.getReturnValue()[i]});
			}
			inputsel.set("v.options", options);

		});

		// Send action off to be executed
		$A.enqueueAction(populatepicklists);

		// Send action off to be executed
	},
	getSelectedName: function (cmp, event) {
		var selectedRows = event.getParam('selectedRows');
		// Display that fieldName of the selected rows
		for (var i = 0; i < selectedRows.length; i++)
		{
			alert("You selected: " + selectedRows[i].Name);
		}    
		var evt = $A.get("e.c:passData");
		evt.setParams({ "passList": selectedRows});
		evt.fire();

	},
	add: function(component, event, helper)
	{
		var selected = event.getParam('selected');
		if(selected==True)
		{
			component.set("v.add", true);
			alert('in add block inff');
		}
	},
	searchKeyChange : function(component, event, helper){
		helper.findByName(component,event); 
	},

})