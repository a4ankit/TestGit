({
	myAction : function(component, event, helper) 
	{ 
		component.set("v.Columns",[
			{label:"Account Name", fieldName:"Name", type:"text", sortable:"true", editable:'true'},
			{label:"Phone", fieldName:"Phone", type:"Number",sortable:"true"},
			{label:"AccountNumber", fieldName:"AccountNumber", type:"text", sortable:"true"},
			{label:"Billing City", fieldName:"BillingCity", type:"text", sortable:"true"},
			{label:"Website", fieldName:"Site", type:"text", sortable:"true"},
			{label:'Delete', name: 'delete', type:"button", typeAttributes: { iconName: 'utility:close', variant:"base" }},   
			]);
		var action = component.get("c.getAccounts");
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

		// Send action off to be executed
		$A.enqueueAction(action);
	},
	openModel: function(component, event, helper) {
		// for Display Model,set the "isOpen" attribute to "true"
		component.set("v.isOpen", true);
	},
	closeModel: function(component,event,helper)
	{
		component.set("v.isOpen", false);
	},
	add: function(component, event, helper)
	{
		
        var passlist = event.getParam("passList");
		var action = component.get("c.getAccounts");
		action.setParams({
			"addAccounts": passlist,
		});
            console.log(JSON.stringify(addAccounts));
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

		// Send action off to be executed
		$A.enqueueAction(action);
		alert('in add block inff');


	},
	closeForm: function(component,event,helper)
	{
		component.set("v.add", false);
	},
	handleSave: function (component, event, helper) {
		var value = event.getParam('draftValues');
		alert('value'+JSON.stringify(value));
		var action = component.get("c.saveAccount");
		action.setParams({ "account" : value});
		action.setCallback(this, function(a) {
			var state = a.getState();
			if (state === "SUCCESS") {
				var name = a.getReturnValue();
				alert("hello from here" + name);
			}
		});
		$A.enqueueAction(action)
	},

	// Client-side controller called by the onsort event handler
	updateColumnSorting: function (cmp, event, helper) {
		var fieldName = event.getParam('fieldName');
		var sortDirection = event.getParam('reverse');
		// assign the latest attribute with the sorted column fieldName and sorted direction
		cmp.set("v.sortedBy", fieldName);
		cmp.set("v.sortedDirection", reverse);
		helper.sortData(cmp, Name, reverse);
	},
	clickSubmit : function(component, event, helper) {
		var tt = component.get("v.AccountList");
		var can = component.get("v.Account");
		var action = component.get("c.saveAccounts");
		action.setParams({"Account":can});
		action.setCallback(this, function(response){
			if(response.getState()==="SUCCESS"){
				tt.push(can);
				component.set("v.AccountList",tt);
			}

		});
		$A.enqueueAction(action);
	},
	/** delRow : function(cmp, event, helper)
        {
            var row = event.getParam('row');
            var rows = cmp.get('v.AccountList');
            var rowIndex = rows.indexOf(row);
            rows.splice(rowIndex, 1);
            cmp.set('v.AccountList', rows);

        },**/

	getSelectedName: function (cmp, event) {
		var selectedRows = event.getParam('selectedRows');
		// Display that fieldName of the selected rows
		for (var i = 0; i < selectedRows.length; i++){
			//alert("You selected this: " + selectedRows[i].Name);
		}
	},
	delRow: function(cmp, event, helper) {
		var action = cmp.get("c.deleteAccount");
		//var button = event.getParam('button');
		var row = event.getParam('row');       
		action.setParams({
			"account":row
		});
		action.setCallback(this, function(response) {
			var state = response.getState();
			if (state === "SUCCESS") {
				var rows = cmp.get('v.AccountList');
				var rowIndex = rows.indexOf(row);
				rows.splice(rowIndex, 1);
				cmp.set('v.AccountList', rows);
			}
			else if (state === "ERROR") {
				// handle error
			}
		});
		$A.enqueueAction(action);
	},
	loadMoreData: function (component, event, helper) {
		//Display a spinner to signal that data is being loaded
		event.getSource().set("v.isLoading", true);
		//Display "Loading" when more data is being loaded
		component.set('v.loadMoreStatus', 'Loading');           
		helper.fetchData(component, component.get('v.rowsToLoad')).then($A.getCallback(function (AccountList) 
				{
			if(component.get('v.AccountList').length >= component.get('v.totalNumberOfRows')) 
			{
				component.set('v.enableInfiniteLoading', false);
				component.set('v.loadMoreStatus', 'No more data to load');
			}
			else
			{
				var currentData = component.get('v.AccountList');
				//Appends new data to the end of the table
				var newData = currentData.concat(AccountList);
				component.set('v.AccountList', newData);
				component.set('v.loadMoreStatus', 'Please wait ');
			}
			event.getSource().set("v.isLoading", false);
				}));
	}
})