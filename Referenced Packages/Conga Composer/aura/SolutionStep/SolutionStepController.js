({
	createSolution: function(cmp, event, helper) {
		helper.showSpinner(cmp);
		var action = cmp.get("c.checkForMetadataAccess");
		action.setCallback(this, function(returnVal) {
			if(cmp.isValid() && returnVal.getState()==="SUCCESS") {
				if(!returnVal.getReturnValue()) {
					var getRemoteSiteUrlsAction = cmp.get("c.getRemoteSiteUrls");
					getRemoteSiteUrlsAction.setCallback(this, function(returnVal) {
						if(cmp.isValid() && returnVal.getState()==="SUCCESS") {
							cmp.set("v.remoteSiteList", returnVal.getReturnValue());
							cmp.set("v.VFServerURL", JSON.parse(returnVal.getReturnValue()).VFServerURL);
							cmp.set("v.MyDomainNameSpaceVFServerBaseURL", "" + JSON.parse(returnVal.getReturnValue()).MyDomainNameSpaceVFServerBaseURL);
							cmp.set("v.SFServerBaseURL", JSON.parse(returnVal.getReturnValue()).SFServerBaseURL);
						} else {
							helper.handleErrors(response, cmp);
						}
						helper.hideSpinner(cmp);
					});
					$A.enqueueAction(getRemoteSiteUrlsAction);
					cmp.find("remoteSiteSettingsModal").openModal();
				} else {
					helper.createSolutionRecord(cmp, helper);
				}
			} else {
				helper.handleErrors(response, cmp);
			}
		});
		$A.enqueueAction(action);
	},
	handleDescriptionFocus: function(cmp, event, helper) {
		helper.hideSampleRecords(cmp);
	},
	hideSampleRecords: function(cmp, event, helper) {
		helper.hideSampleRecords(cmp);
	},
	init: function(cmp, event, helper) {
		var solutionId = cmp.get("v.solutionId");
		var action = cmp.get("c.getAvailableObjects");
		helper.callAction(cmp, action).then(function(returnVal) {
			returnVal.unshift({
				"Key": "-- Select a Salesforce Object --",
				"Value": ""
			});
			cmp.set("v.objectList", returnVal);
		});
		if(solutionId) {
			var action = cmp.get("c.getSolutionDetails");
			helper.callAction(cmp, action, {
				solutionId: solutionId
			}).then(function(solutionDetailsWrapper) {
				cmp.set("v.solutionName", solutionDetailsWrapper.name);
				cmp.set("v.description", solutionDetailsWrapper.description);
				cmp.set("v.sampleRecordId", solutionDetailsWrapper.sampleRecordId);
				cmp.set("v.sampleRecordName", solutionDetailsWrapper.sampleRecordName);
				cmp.set("v.masterObject", solutionDetailsWrapper.masterObject);
				cmp.set("v.masterObjectLabel", solutionDetailsWrapper.masterObjectLabel);
				cmp.set("v.tempObjectName", solutionDetailsWrapper.masterObject);
				cmp.set("v.tempObjectLabel", solutionDetailsWrapper.masterObjectLabel);
				cmp.find("searchAndSelectSampleRecord").set("v.enabled", true);
			});
		}
		window.setTimeout(
			$A.getCallback(function() {
				cmp.find("solutionName").focus();
			}), 1
		);
	},
	onMasterObjectChange: function(cmp, event, helper) {
		var searchCmp = cmp.find("searchAndSelectSampleRecord");
		var selectedObjectIndex = cmp.find("selectMasterObject").get("v.value");
		var selectedObject = cmp.get("v.objectList")[selectedObjectIndex];
		cmp.set("v.tempObjectName", selectedObject.Value);
		cmp.set('v.tempObjectLabel', selectedObject.Key);
		searchCmp.set("v.enabled", true);
		searchCmp.set("v.searchStr", "");
		searchCmp.set("v.sampleRecordId", "");
		searchCmp.reInit();
	}
})