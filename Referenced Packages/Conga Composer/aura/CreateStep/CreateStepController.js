({
	init: function(cmp, e, helper) {
		helper.getUserInfo(cmp, e, false);
	},
	initMixPanel: function(cmp, e, helper) {
		//This function will be called asynchronously after the script loads. Call back to the server here to get the user information to initialize mixpanel. 
		//We"re also calling back to the server on the component init. Two callbacks are necessary because we don"t want functionality dependent upon the afterScriptsLoaded of a static resource.
		helper.getUserInfo(cmp, e, true);
	},
	showQuickStart: function(cmp, e, helper) {
		window.mixpanel.track("Quickstart: Path Selected");
		lightningUtils.navigateTo(cmp, "QuickStartPackagesStep");
	},
	showWizard: function(cmp, e, helper) {
		window.mixpanel.track("Custom: Path Selected");
		lightningUtils.navigateTo(cmp, "SolutionStep");
	}
})