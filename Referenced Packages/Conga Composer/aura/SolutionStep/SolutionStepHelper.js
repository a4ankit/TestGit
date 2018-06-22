({
	createSolutionRecord : function(cmp, helper) {
		var solutionId = cmp.get("v.solutionId");
		var solutionName = cmp.find("solutionName").get("v.value");
		var objectType = cmp.find("selectMasterObject").get("v.value");
		var sampleRecordId = cmp.find("searchAndSelectSampleRecord").get("v.sampleRecordId");
		var searchStr = cmp.find("searchAndSelectSampleRecord").get("v.searchStr");
		var description = cmp.find("description").get("v.value");
		var objectLabel = cmp.get("v.tempObjectLabel");
		cmp.set("v.masterObject", cmp.get("v.tempObjectName"));
		cmp.set("v.masterObjectLabel", objectLabel);
		var solutionNameGood = false;
		var objectTypeGood = false;
		var sampleRecordGood = false;
		if(solutionName != null && solutionName.trim() != "") {
			solutionNameGood = true;
		}
		if(objectType != null && objectType.trim() != "") {
			objectTypeGood = true;
		}
		if(sampleRecordId != null && sampleRecordId.trim() != "") {
			sampleRecordGood = true;
		} else {
			cmp.find("searchAndSelectSampleRecord").set("v.searchStr", "");
		}
		if(solutionNameGood && objectTypeGood && sampleRecordGood) {
			this.callAction(cmp, cmp.get("c.getCreateSolutionRecord"), {
				solutionId: solutionId,
				solutionName: solutionName,
				objectType: objectType, 
				sampleRecordId: sampleRecordId,
				sampleRecordName: searchStr,
				description: description
			}).then(function(returnVal) {
	        	cmp.set("v.solutionId", returnVal);
		        var stateObj = {
		        	solutionStep: "solutionStep"
    			};
		        window.history.pushState(stateObj, "Details: 1", '/apex/SolutionStep'+'?mo='+objectType+'&mol='+objectLabel+'&sid='+returnVal+'&sn='+solutionName);		        
		        helper.navigatePrevNext(cmp, true);
		    });
		} else {
			cmp.find("solutionName").showHelpMessageIfInvalid();
			cmp.find("selectMasterObject").showHelpMessageIfInvalid();
			document.getElementsByName("searchInput")[0].focus();
			document.getElementsByName("searchInput")[0].blur();
			helper.hideSpinner(cmp);
		}
	},
	hideSampleRecords : function(cmp) {
		cmp.find("searchAndSelectSampleRecord").hideSampleRecords();
	},
	hideSpinner: function(cmp) {
		cmp.set("v.showSpinner", false);
	},
	showSpinner: function(cmp) {
		cmp.set("v.showSpinner", true);
	}
})