({
    selectSolution : function(cmp, e, helper) {
        //Spin!
        helper.showSpinner(cmp);
        //Set the master object for redirection upon finishing step
        cmp.set("v.masterObject", e.currentTarget.title); 
        //Get the solution to unpack from the button value, save it in cmp attribute so that the event fired from the modal, if popped, knows which solution to unpack
        cmp.set("v.solutionToUnpack", e.currentTarget.id); 
        //Yes, this is the easy way out. Replace shorthand and underscores.
        var solutionName = e.currentTarget.id.replace('CongaSP', 'Composer');
        var re = /_/gi;
        cmp.set("v.solutionName", solutionName.replace(re, ' ')); 

        // Check to see if org already has remote sites for access to the metadata api, through apex
        var checkForMetadataAccessAction = cmp.get("c.checkForMetadataAccess");
        checkForMetadataAccessAction.setStorable();

        checkForMetadataAccessAction.setCallback(this, function(a) {
        var status = a.getState();
        if (cmp.isValid() && status === "SUCCESS") {
            
            // If the metadata api isn't available 
            if (a.getReturnValue()==false){
                window.mixpanel.track("Quickstart: Remote Sites Needed");
                // Get a list of the urls to add as remote sites
                var getRemoteSiteUrlsAction = cmp.get("c.getRemoteSiteUrls");
                getRemoteSiteUrlsAction.setStorable();

                getRemoteSiteUrlsAction.setCallback(this, function(a) {
                    var status = a.getState();
                    if (cmp.isValid() && status === "SUCCESS") {
                        // Set the list of remotes sites here, which will be dynamically loaded into the RemoteSiteSettingsModal remoteSiteList attribute
                        cmp.set("v.remoteSiteList", a.getReturnValue()); 
                        cmp.set("v.VFServerURL", JSON.parse(a.getReturnValue()).VFServerURL);
                        cmp.set("v.MyDomainNameSpaceVFServerBaseURL", "" + JSON.parse(a.getReturnValue()).MyDomainNameSpaceVFServerBaseURL);
                        cmp.set("v.SFServerBaseURL", JSON.parse(a.getReturnValue()).SFServerBaseURL);
                    }
                    else {
                        helper.handleErrors(response, cmp);
                    }
                });
                $A.enqueueAction(getRemoteSiteUrlsAction);
                
                helper.hideSpinner(cmp);
                var createModal = cmp.find("remoteSiteSettingsModal");
                createModal.openModal();
            }
            else{
                window.mixpanel.track("Quickstart: Remote Sites Exist");
                // The metadata api is already available, don't pop the modal, do unpack solutions and go to next step
                var solutionToUnpack = cmp.get("v.solutionToUnpack");
                if (typeof solutionToUnpack !== "undefined"){
                    //Do the work
                    helper.unpackSolutionAndCreateButton(cmp, solutionToUnpack);
                }
                else {
                    helper.hideSpinner(cmp);
                }
                
            }
        }
        else {
            helper.hideSpinner(cmp);
            helper.handleErrors(response, cmp);
        }
    
        });
        $A.enqueueAction(checkForMetadataAccessAction);

    },
    captureRemoteSiteSettingsEvent : function(cmp, e, helper) {
        helper.showSpinner(cmp);
        // This event is fired from the modal, after the user OKs the remote sites to be set up
        // Get the session id from Apex to be used in the javascript XMLHttpRequest Soap request to the metadata api
        var action = cmp.get("c.getSessionId");
        action.setCallback(this, function(a) {
            
            var status = a.getState();
            if (cmp.isValid() && status === "SUCCESS") {
                // Send the SOAP request with the session id and list of remote sites
                helper.createRemoteSite(a.getReturnValue(), cmp.get("v.remoteSiteList"));
                // Unpack the solution and create the damn button. This will also navigate to next step.
                helper.unpackSolutionAndCreateButton(cmp, cmp.get("v.solutionToUnpack"));
            }
            else {
                handleErrors(response, cmp);
            }

        });

        $A.enqueueAction(action);
    }
})