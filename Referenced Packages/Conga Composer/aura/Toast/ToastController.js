({
	showPrompt: function (cmp, event, helper) {
		var showOnEvent = cmp.get("v.showOnEvent");
		if (showOnEvent) {
			var params = event.getParam('arguments');
			if (params) {
				var title = params.title;
				var message = params.message;
				var theme = params.theme;
				var icon = params.icon;
				var toastTheme = "";
				var toastIcon = "";
				
				if (title && title.length > 0) cmp.set("v.title", title);
				if (theme=="success"){
					toastTheme = "slds-theme--success";
					toastIcon = "success";
				} else if (theme=="warning") {
					toastTheme = "slds-theme--warning";
					toastIcon = "warning";
				} else if (theme=="error") {
					toastTheme = "slds-theme--error";
					toastIcon = "error";
				}
				cmp.set("v.message", message);
				cmp.set("v.theme", toastTheme);
				cmp.set("v.icon", toastIcon);
				cmp.set("v.visible", true);
			}
		}
	},
	hidePrompt: function (cmp, event, helper) {
		cmp.set("v.visible", false);
	}
})