/* global $DM:false */
({
    afterScriptsLoaded: function(cmp, event, helper) {
        cmp.set('v.hierarchyTypeStr', $DM.journey.SettingsHierarchy.ACCOUNT);
        helper.isStandardUser(cmp, function(result) {
            cmp.set('v.hasAccess', result);
            cmp.set('v.isLoading', false);
        });
    },

    applyChanges: function(cmp) {
        cmp.find('settingsForm').applyChanges();
    }
})