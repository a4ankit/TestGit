({
    addGreetingMapping: function(cmp) {
        var greetingMappingsSettings = cmp.get('v.greetingMappingsSettings'),
            action = cmp.get('c.getBlankGreetingMappingsSetting');

        action.setCallback(this, function(response) {
            if (cmp.isValid() && response.getState() === 'SUCCESS') {
                greetingMappingsSettings.push(response.getReturnValue());
                cmp.set('v.greetingMappingsSettings', greetingMappingsSettings);
            }
        });

        $A.enqueueAction(action);
    },

    deleteGreeting: function(cmp, event) {
        var greetingMappingsSettings = cmp.get('v.greetingMappingsSettings'),
            deletedGreetingMappingsSettings = cmp.get('v.deletedGreetingMappingsSettings') || [],
            index = event.getSource().get('v.value');

        if (!$A.util.isEmpty(greetingMappingsSettings[index].objectGreetingMappings[0].id)) {
            deletedGreetingMappingsSettings.push(greetingMappingsSettings[index]);
        }

        greetingMappingsSettings.splice(index, 1);

        cmp.set('v.greetingMappingsSettings', greetingMappingsSettings);
        cmp.set('v.deletedGreetingMappingsSettings', deletedGreetingMappingsSettings);
    },

    setGreetingAsDefault: function(cmp, event, helper) {
        var index = event.getSource().get('v.value');

        helper.resetDefaults(cmp);

        cmp.set('v.greetingMappingsSettings.'+index+ '.defaultSetting', true);
    }
})