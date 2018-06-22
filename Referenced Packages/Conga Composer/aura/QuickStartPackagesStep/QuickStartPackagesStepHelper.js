({
	createRemoteSite : function(sessionId, remoteSiteList)
	{ 
		// Calls the Metdata API from JavaScript to create the Remote Site Setting to permit Apex callouts
		// The urn:CallOptions element is required for Professional Edition
		var binding = new XMLHttpRequest();
		var request = 
			'<?xml version="1.0" encoding="utf-8"?>' + 
			'<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cmd="http://soap.sforce.com/2006/04/metadata" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'+
				'<soap:Header>' + 
					'<cmd:SessionHeader xmlns:urn="http://soap.sforce.com/2006/04/metadata">' + 
						'<cmd:sessionId>' + JSON.parse(sessionId).sessionId + '</cmd:sessionId>' + 
					'</cmd:SessionHeader>' + 
					'<cmd:CallOptions><client>AppExtremes/</client></cmd:CallOptions>' +
				'</soap:Header>' + 
				'<soap:Body>' +
					'<createMetadata xmlns="http://soap.sforce.com/2006/04/metadata">' + 
						'<metadata xsi:type="RemoteSiteSetting">' + 
							'<fullName>Conga_Front_End</fullName>' +
							'<description>Metadata API Remote Site Setting for Conga QuickStart Solution Packs</description>' + 
							'<disableProtocolSecurity>false</disableProtocolSecurity>' + 
							'<isActive>true</isActive>' + 
							'<url>https://' + JSON.parse(remoteSiteList).SFServerBaseURL + '</url>' +
						'</metadata>' +
	        			'<metadata xsi:type="RemoteSiteSetting">' + 
							'<fullName>Composer_VisualForce</fullName>' +
							'<description>Metadata API Remote Site Setting for Conga QuickStart Solution Packs</description>' + 
							'<disableProtocolSecurity>false</disableProtocolSecurity>' + 
							'<isActive>true</isActive>' + 
							'<url>https://' + JSON.parse(remoteSiteList).MyDomainNameSpaceVFServerBaseURL + '</url>' +
						'</metadata>' +
						'<metadata xsi:type="RemoteSiteSetting">' + 
							'<fullName>Standard_VisualForce</fullName>' +
							'<description>Metadata API Remote Site Setting for Conga QuickStart Solution Packs</description>' + 
							'<disableProtocolSecurity>false</disableProtocolSecurity>' + 
							'<isActive>true</isActive>' + 
							'<url>https://' + JSON.parse(remoteSiteList).VFServerURL + '</url>' +
						'</metadata>' +
					'</createMetadata>' +
				'</soap:Body>' + 
			'</soap:Envelope>';

		try {
			binding.open('POST', 'https://' + JSON.parse(remoteSiteList).MyDomainNameSpaceVFServerBaseURL + '/services/Soap/m/39.0');

			
			binding.setRequestHeader('SOAPAction','""');
			binding.setRequestHeader('Content-Type', 'text/xml');
			binding.onreadystatechange = 
				function() { 
					if(this.readyState==4) {
						/*alert(this.response);
						//TODO:Handle error properly
						var parser = new DOMParser();
						var doc  = parser.parseFromString(this.response, 'application/xml');
						var errors = doc.getElementsByTagName('errors');
						var messageText = '';
						for(var errorIdx = 0; errorIdx < errors.length; errorIdx++)
							messageText+= errors.item(errorIdx).getElementsByTagName('message').item(0).innerHTML + '\n';

						System.debug(messageText);*/
					} 
				}
			binding.send(request);
		}
		catch(e) {
			//Cannot send XMLHttpRequest through locker service (lightning experience with myDomains enabled) so navigate user to manually add remote site settings
			//Alter this flow, check for myDomains first then navigate or pop modal
			//Latest 5/2017 force lightning out in all cases so we should never get here.
			alert('My Domains Enabled. Must add remote sites manually.');

		}	
	},
	unpackSolutionAndCreateButton : function(cmp, solutionToUnpack){
		window.mixpanel.track("Quickstart: " + solutionToUnpack + " Selected");

		//These are done as two separate transactions because this was happening: https://help.salesforce.com/articleView?id=000003701&type=1
		var action = cmp.get("c.getUnpackSolution");
		action.setParams({
	        solutionToUnpack : solutionToUnpack
	    });

		var action2 = cmp.get("c.getCreateButton");

        action.setCallback(this, function(a) {
            
            var status = a.getState();
            var response = a.getReturnValue();
            if (status === "SUCCESS") {
            	//getCreateButton Apex controller will return 'SUCCESS' string or string with error information 
                if (response == 'SUCCESS') {
                	window.mixpanel.track("Quickstart: " + solutionToUnpack + " Unpacked");
                	$A.enqueueAction(action2);
                }
                else {
                	this.handleErrors(response, cmp);
                }
                
            }
            else {
            	
                this.handleErrors(a, cmp);
            }

        });

        action2.setCallback(this, function(a) {
            
            var status = a.getState();
            var response = a.getReturnValue();
            if (status === "SUCCESS") {
            	//getCreateButton Apex controller will return 'SUCCESS' string or string with error information
                if (response == 'SUCCESS') {
                	window.mixpanel.track("Quickstart: " + solutionToUnpack + " Button Created");
                	//Go to finish step
                	//this.hideSpinner(cmp);
                	this.navigateAway(cmp);
                }
                else {
                	//TODO: meaningful error display. ui:message?
                	this.handleErrors(response, cmp);
                }	
            }
            else {
            	
                this.handleErrors(a, cmp);
            }

        });
        
        $A.enqueueAction(action);
		},
	navigateAway : function(cmp){
		
		var theme = cmp.get("v.theme");
        var inVFPage = cmp.get("v.inVFPage");
        
		window.location.assign('/apex/FinishStepQ?mo=' + cmp.get("v.masterObject")+'&sn='+cmp.get("v.solutionName")+'&theme='+theme);

	},
    // this function automatic call by aura:waiting event  
    showSpinner: function(cmp) {
       // make Spinner attribute true for display loading spinner 
        cmp.set("v.showSpinner", true);
   },
    // this function automatic call by aura:doneWaiting event 
    hideSpinner : function(cmp) {
     // make Spinner attribute to false for hide loading spinner    
       cmp.set("v.showSpinner", false);
    },
    handleErrors : function(response, cmp) {
    	this.hideSpinner(cmp);
    	this.showToast(cmp, response);
    },
    showToast : function(cmp, message) {
    	//Show toast
    	var toastComponent = cmp.find('toastComponent');
    	toastComponent.showToast($A.get("$Label.apxtconga4.Toast_Title"), message, "error", "error");
    }
})