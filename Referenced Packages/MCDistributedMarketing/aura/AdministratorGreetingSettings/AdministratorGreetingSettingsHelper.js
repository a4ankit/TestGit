({
    resetDefaults: function(cmp) {
        var greetingMappingsSettings = cmp.get('v.greetingMappingsSettings');

        greetingMappingsSettings.forEach(function(greeting) {
            greeting.defaultSetting = false;
        });

        cmp.set('v.greetingMappingsSettings', greetingMappingsSettings);
    }
})