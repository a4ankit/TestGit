({
    afterScriptsLoaded: function(cmp, event, helper) {
        helper.init(cmp);
    },

    launchJourneyApprovals: function(cmp) {
        $A.enqueueAction(cmp.get('v.navigationHandler'));
    },

    applyJourneyLinkChanges: function(cmp) {
        cmp.get('v.connectCampaignCmp')[0].saveJourneyLinkage($A.getCallback(function() {
            cmp.get('v.connectCampaignModal')[0].close();
        }));
    },

    closeConnectCampaignModal: function(cmp) {
        cmp.get('v.connectCampaignModal')[0].close();
    },

    launchConnectJourney: function(cmp, event, helper) {
        helper.launchConnectJourney(cmp);
    },

    handlePreviewRequested: function(cmp, event, helper) {
        helper.launchJourneyPersonalization(cmp, event.getSource().get('v.activity'));
    },

    handleSettingsSelection: function(cmp, event, helper) {
        var selectedVal = event.getParam('value');
        switch(selectedVal) {
            case helper.SettingsCogOptions.EDIT_CONNECTION:
                helper.launchConnectJourney(cmp);
                break;
            case helper.SettingsCogOptions.PERSONALIZATION_DEFAULTS:
                helper.launchJourneyPersonalization(cmp);
                break;
            case helper.SettingsCogOptions.PERSONALIZATION_SETTINGS:
                helper.launchAdminPage(cmp);
                break;
            case helper.SettingsCogOptions.SETTINGS:
                helper.launchDefaultSettingsPage(cmp);
                break;
            default:
                throw new Error('Option type not supported');
        }
    }
})