({
    init: function(cmp) {
        var pluginSettingsService = cmp.find('pluginSettingsService');
        pluginSettingsService.getPlugin(function(result) {
            cmp.set('v.isPluginConfigured', !$A.util.isEmpty(result));
        });

        pluginSettingsService.getLabel(function(result) {
            cmp.set('v.tabName', result);
        });
    },

    handleApplyChanges: function(cmp) {
        var pluginSettingsService = cmp.find('pluginSettingsService');
        if (cmp.get('v.isPluginConfigured')) {
            pluginSettingsService.setLabel(cmp.get('v.tabName'), null);
        }
    }
})