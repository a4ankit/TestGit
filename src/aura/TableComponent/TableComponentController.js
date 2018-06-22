({
    myAction : function(component, event, helper) 
    {component.set("v.Columns", [
        {label:"Account Name1", fieldName:"Name", type:"String", sortable:"true"},
        {label:"Phone", fieldName:"Phone", type:"Number",sortable:"true"},
        {label:"Type", fieldName:"Type", type:"text", sortable:"true"},
        {label:"Industry", fieldName:"Industry", type:"text", sortable:"true"},
        {label:"Website", fieldName:"Website", type:"text", sortable:"true"}
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
    loadMoreData: function (cmp, event, helper) {
        var rowsToLoad = cmp.get('v.rowsToLoad'),
            fetchData = cmp.get('v.dataTableSchema'),
            promiseData;

        event.getSource().set("v.isLoading", true);
        cmp.set('v.loadMoreStatus', 'Loading');
        
        promiseData = helper.fetchData(cmp, fetchData, rowsToLoad);
        
        promiseData.then($A.getCallback(function (data) {
                if (cmp.get('v.data').length >= cmp.get('v.totalNumberOfRows')) {
                    cmp.set('v.enableInfiniteLoading', false);
                    cmp.set('v.loadMoreStatus', 'No more data to load');
                } else {
                    var currentData = cmp.get('v.data');
                    var newData = currentData.concat(data);
                    cmp.set('v.data', newData);
                    cmp.set('v.loadMoreStatus', '');
                }
                event.getSource().set("v.isLoading", false);
            }));
    }
        
        
        
})