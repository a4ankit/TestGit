({
    doInit: function(component, event, helper) {
        var load = component.get("c.getAccounts");
        load.setCallback(this, function(result) {
            component.set("v.records", result.getReturnValue());
            component.set("v.sortAsc", true);
            helper.sortBy(component, "Name");
        });
        $A.enqueueAction(load);
    },
    searchKeyChange : function(component, event, helper){
        helper.findByName(component,event); 
    },
    sortByName: function(component, event, helper) {
        helper.sortBy(component, "Name");
    },
    sortByAmount: function(component, event, helper) {
        helper.sortBy(component, "Id");
    },
    downloadCsv : function(component,event,helper){
        
        // get the Records [Account] list from 'Account' attribute 
        var stockData = component.get("v.records");
        alert('stockData'+stockData);
        // call the helper function which "return" the CSV data as a String   
        var csv = helper.convertArrayOfObjectsToCSV(component,stockData);   
        if (csv == null){return;} 
        
        // ####--code for create a temp. <a> html tag [link tag] for download the CSV file--####     
        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
        hiddenElement.target = '_self'; // 
        hiddenElement.download = 'ExportData.csv';  // CSV file Name* you can change it.[only name not .csv] 
        document.body.appendChild(hiddenElement); // Required for FireFox browser
        hiddenElement.click(); // using click() js function to download csv file
    },
    
})