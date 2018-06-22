({
    doInit : function(component, event, helper) {
        //helper.GetAccountList(component,event);
        var action = component.get("c.accountListToDisplay");
        action.setCallback(this,function(response){
            console.log('response:::'+JSON.stringify(response.getReturnValue()));
            component.set("v.accountList",response.getReturnValue());
        });
        $A.enqueueAction(action);
    },
    saveAccount : function(component,event,helper){
        var accountObj = component.get("v.newAccount");
        console.log('accountObj:::'+accountObj);
        var action = component.get("c.accountToInsert");
     action.setParams({ acc : accountObj});
        action.setCallback(this,function(response){
            console.log(':::::'+response.getReturnValue()); 
        });
       $A.enqueueAction(action); 
 }
 })