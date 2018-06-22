({
    afterScriptsLoaded: function(cmp) {
        var greetingValue = cmp.get('v.defaultSettings').greeting.value;
        cmp.find('greetingSelect').set('v.value', greetingValue);
        cmp.set('v.savedGreeting', greetingValue);
    },

    handleInputChanged: function(cmp) {
        var greeting = cmp.find('greetingSelect').get('v.value'),
            savedGreeting = cmp.get('v.savedGreeting');

        cmp.getEvent('personalizationChanged')
            .setParams({ isDirty: greeting !== savedGreeting })
            .fire();
    },

    applyChanges: function(cmp, event, helper) {
        var selectCmp = cmp.find('greetingSelect'),
            greeting = selectCmp.get('v.value'),
            defaultSettings = cmp.get('v.defaultSettings'),
            savedGreeting = cmp.get('v.savedGreeting');

        if (greeting !== savedGreeting) {
            var option = helper.getGreetingOptionFromSelectionValue(cmp, greeting);
            defaultSettings.greeting = option;
            selectCmp.set('v.value', option.value);
            cmp.set('v.savedGreeting', option.value);
        }
    }
})