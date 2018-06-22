({
	hideAll: function(cmp, event, helper) {
		cmp.set("v.showItems", false);
	},
	loadSampleRecords: function(cmp, event, helper) {
		cmp.set("v.itemsToShow", 10);
		var myMasterObject = cmp.get("v.myMasterObject");
		if(myMasterObject) {
			// map the sObjects which do not have a Name field to the correct field
			helper.callAction(cmp, cmp.get("c.getNameFieldForObject"), {
				objectName: myMasterObject
			}).then(function(returnVal) {
				cmp.set("v.sObjectMappedName", returnVal);
				helper.callAction(cmp, cmp.get("c.getRecords"), {
					ObjectName: myMasterObject,
					limits: "1000",
					fieldstoget: "Id, "+cmp.get("v.sObjectMappedName"),
					pageNumber: 1,
					pageSize: "1000"
				}).then(function(returnVal) {
					// re-map the non-standard Name field (Ex: CaseNumber) back to Name so the UI is consistently using Name
					var tempArr = [];
					for(var i=0; i<returnVal.sObjectrecords.length; i++) {
						for(var field in returnVal.sObjectrecords[i]) {
							if(!field.match(/Id/i) && !field.match(/Name/i)) {
								tempArr.push(new helper.SampleData(returnVal.sObjectrecords[i].Id, returnVal.sObjectrecords[i][field]));
							}
						}
					}
					if(tempArr.length>0) {
						cmp.set("v.items", tempArr);
					} else {
						cmp.set("v.items", returnVal.sObjectrecords);
					}
				}).catch(function(err) {
					cmp.getSuper().getSuper().find("toastComponent").showToast($A.get("$Label.apxtconga4.Toast_Title"), err, "error", "error");
					return;
				});
			}).catch(function(err) {
				cmp.getSuper().getSuper().find("toastComponent").showToast($A.get("$Label.apxtconga4.Toast_Title"), err, "error", "error");
				return;
			});
		}
	},
	SampleData: function(pId, pName) {
		this.Id = pId;
		this.Name = pName;
	}
})