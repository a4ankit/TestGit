({
    handleUploadFinished: function (cmp, event) {
        // Get the list of uploaded files
        var uploadedFiles = event.getParam("files");
        // show success message – with no of files uploaded
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "title": "Success!",
            "type" : "success",
            "message": uploadedFiles.length+"files has been updated successfully!"
        });
        toastEvent.fire();
        
        $A.get('e.force:refreshView').fire();
        
        // Close the action panel
        var dismissActionPanel = $A.get("e.force:closeQuickAction");
        dismissActionPanel.fire();
    },
    
})