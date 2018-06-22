({
	init: function (component, event, helper) {
		var action = component.get("c.getRecords");
		var fields = "Id,APXTConga4__Name__c,APXTConga4__Template_Group__c,APXTConga4__Description__c"
		action.setParams({
			ObjectName: "APXTConga4__Conga_Template__c",
			limits: "1000",
			fieldstoget: fields,
			pageNumber: 1,
			pageSize: "100"
		});
		action.setCallback(this, function (response) {
			var state = response.getState();
			if(state==="SUCCESS") {
				component.set("v.items", response.getReturnValue().sObjectrecords);
				/*component.set("v.latestRecords",response.getReturnValue().sObjectrecords);
                
				component.set("v.page",page);
				var retResponse = response.getReturnValue();
				//alert(JSON.stringify(retResponse.sObjectrecords[0].APXTConga4__Conga_Template__r.APXTConga4__Description__c));
				component.set("v.total",retResponse.total);
				component.set("v.pages",Math.ceil(retResponse.total/component.get("v.pageSize")))
				var retRecords = retResponse.sObjectrecords;*/
			} else if (state === "ERROR") {
				console.log('Error ' + JSON.stringify(response));
			}
		});
		$A.enqueueAction(action);
	}
})