({
    getSendSettingData: function(cmp, callback) {
        var action = cmp.get('c.getSendSettingData');

        action.setParams({
            hierarchyTypeStr: cmp.get('v.hierarchyTypeStr'),
            typeId: cmp.get('v.typeId')
        });

        action.setCallback(this, function(response) {
            if (cmp.isValid() && response.getState() === 'SUCCESS') {
                var data = response.getReturnValue();
                cmp.set('v.settings', data);
                callback();
            }
        });

        $A.enqueueAction(action);
    },

    applyDefaultJourneySendSettings: function(cmp, callback) {
        var action = cmp.get('c.setDefaultJourneySendSetting'),
            savedSettings = cmp.get('v.settings.savedSetting');

        action.setParams({
            hierarchyTypeStr: cmp.get('v.hierarchyTypeStr'),
            typeId: cmp.get('v.typeId'),
            sendSettingObjs: JSON.stringify(savedSettings)
        });

        action.setCallback(this, function(response){
            if (cmp.isValid() && response.getState() === 'SUCCESS') {
                cmp.set('v.settings.savedSetting', response.getReturnValue());
                callback();
            }
        });

        $A.enqueueAction(action);
    }
})