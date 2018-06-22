/* global $DM:false */
({
    afterScriptsLoaded: function(cmp, event, helper) {
        var permissionSetService = cmp.find('permissionSetService');

        permissionSetService.getIsAdminUser(function(result) {
            cmp.set('v.hasAccess', result);

            if (!result) {
                cmp.set('v.isLoading', false);
                return;
            }

            helper.isConfigured(cmp, function(response) {
                var adminSettingsCallback = function(administratorSettings) {
                    cmp.set('v.administratorSettings', administratorSettings);
                    cmp.set('v.isLoading', false);
                };
                var postInstallPageUrlCallback = function(url) {
                    cmp.set('v.postInstallPageUrl', url);
                    helper.getAdministratorSettings(cmp, adminSettingsCallback);
                };

                cmp.set('v.isConfigured', response);

                if (response) {
                    helper.getAdministratorSettings(cmp, adminSettingsCallback);
                } else {
                    helper.getPostInstallPageUrl(cmp, postInstallPageUrlCallback);
                }
            });
        });
    },

    navigateToPostInstallPage: function(cmp, event, helper) {
        helper.navigateToUrl(cmp.get('v.postInstallPageUrl'));
    },

    applyChanges: function(cmp, event, helper) {
        var errorMessage = helper.validateForm(cmp);

        cmp.set('v.isLoading', true);

        if (errorMessage) {
            $DM.messages.showFailure(errorMessage);
            cmp.set('v.isLoading', false);
            return;
        }

        cmp.find('pluginSettings').applyChanges();
        helper.setAdministratorSettings(cmp);
    }
})