({
	getUserInfo: function(cmp, e, setMixPanel) {
		var action = cmp.get("c.getUserInformation");
		action.setCallback(this, function(a) {
			var status = a.getState();
			if(status === "SUCCESS") {
				let userInfo = a.getReturnValue();
				cmp.set("v.theme", userInfo.theme);
				if(setMixPanel == true) {
					// Setup mixpanel to capture profile and session info
					// Identify this user as org + userId combo
					window.mixpanel.identify(userInfo.orgId + userInfo.userId);
					// Properties that will be tracked with every event
					window.mixpanel.register(userInfo);
					// Info about this user
					window.mixpanel.people.set(userInfo);
				}
			} else {
				var errors = response.getError();
				if(errors.length > 0) {
					errors = errors[0].message;
				}
				//Show toast
				var toastComponent = cmp.find("toastComponent");
				toastComponent.showToast($A.get("$Label.apxtconga4.Toast_Title"), errors, "error", "error");
			}
		});
		$A.enqueueAction(action);
	}
})