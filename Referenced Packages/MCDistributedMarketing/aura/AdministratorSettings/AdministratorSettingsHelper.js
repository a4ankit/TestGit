/* global $DM:false */
({
    getPostInstallPageUrl: function(cmp, callback){
        var action = cmp.get('c.getPostInstallPageUrl');

        action.setCallback(this, function(response) {
            if (cmp.isValid() && response.getState() === 'SUCCESS') {
                callback(response.getReturnValue());
            }
        });

        $A.enqueueAction(action);
    },

    isConfigured: function(cmp, callback) {
        var action = cmp.get('c.isConfigured');

        action.setCallback(this, function(response) {
            if (cmp.isValid() && response.getState() === 'SUCCESS') {
                callback(response.getReturnValue());
            }
        });

        $A.enqueueAction(action);
    },

    navigateToUrl: function(url) {
        $A.get('e.force:navigateToURL')
            .setParams({
                isredirect: true,
                url: url
            })
            .fire();
    },

    getAdministratorSettings: function(cmp, callback) {
        var action = cmp.get('c.getAdministratorSettings');

        action.setCallback(this, function(response) {
            var data = response.getReturnValue() || {};

            if (cmp.isValid() && response.getState() === 'SUCCESS') {
                callback(data);
            } else {
                $DM.messages.showActionFailure(response, $A.get('$Label.mcdm_15.errorFetchingContent'));
            }
        });

        $A.enqueueAction(action);
    },

    setAdministratorSettings: function(cmp) {
        var action = cmp.get('c.setAdministratorSettings');

        action.setParams({
            settingData: JSON.stringify(cmp.get('v.administratorSettings'))
        });

        action.setCallback(this, function(response) {
            if (cmp.isValid() && response.getState() === 'SUCCESS') {
                $A.get('e.force:refreshView').fire();
            } else {
                $DM.messages.showActionFailure(response);
            }
        });

        $A.enqueueAction(action);
    },

    validateForm: function(cmp) {
        var administratorSettings = cmp.get('v.administratorSettings'),
            message;

        var labelArr = administratorSettings.greetingMappingsSettings.map(function(setting) {
            return setting.greetingLabel.toLowerCase();
        });

        administratorSettings.greetingMappingsSettings.some(function(setting, index) {
            var label = setting.greetingLabel.toLowerCase();
            if ($A.util.isEmpty(label)) {
                message = $A.get('$Label.mcdm_15.pleaseCompleteAllFields');
                return true;
            }

            if (labelArr.indexOf(label) !== index) {
                message = $A.get('$Label.mcdm_15.duplicateGreetingLabelsDetected');
                return true;
            }

            return setting.objectGreetingMappings.some(function(objectMapping) {
                if ($A.util.isEmpty(objectMapping.fieldValue)) {
                    message = $A.get('$Label.mcdm_15.pleaseCompleteAllFields');
                    return true;
                }

                return false;
            });
        });

        return message;
    }
})