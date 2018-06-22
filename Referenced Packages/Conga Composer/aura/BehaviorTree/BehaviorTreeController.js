({
	handleClick : function(cmp, evt, helper) {
        var treeEvent = cmp.getEvent("behaviorSelect");
        var componentToLoad = evt.currentTarget.id;
        var message = "";
        
        var treeItemIds = ["backgroundModeSettingsNode", "generatedFileSettingsNode", "activityLoggingNode", "emailNode", "eSignatureSettingsNode", "saveACopyNode"];
        var liId = "";
        var liCmp = "";
        for(var i=0; i<treeItemIds.length; i++) {
            liId = treeItemIds[i];
            liCmp = cmp.find(liId);
            if(liId === componentToLoad) {
            	$A.util.addClass(liCmp, "slds-is-selected");
            } else {
            	$A.util.removeClass(liCmp, "slds-is-selected");
            }
        }
        
        if(componentToLoad == "backgroundModeSettingsNode") {
            message = "APXTConga4:BackgroundModeBehaviorSettings";
        } else if(componentToLoad == "generatedFileSettingsNode") {
        	message = "APXTConga4:GeneratedFileBehaviorSettings";
        } else if(componentToLoad == "activityLoggingNode") {
        	message = "APXTConga4:ActivityLoggingBehaviorSettings";
        } else if(componentToLoad == "emailNode") {
            message = "APXTConga4:EmailBehaviorSettings";
        } else if(componentToLoad == "eSignatureSettingsNode") {
        	message = "APXTConga4:ESignatureBehaviorSettings";
        } else if(componentToLoad == "saveACopyNode") {
            message = "APXTConga4:SaveACopyBehaviorSettings";
        }
        
        treeEvent.setParam("message", message);
        treeEvent.fire();
	}
})