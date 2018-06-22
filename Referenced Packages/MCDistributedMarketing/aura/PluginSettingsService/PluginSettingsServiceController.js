({
    handleGetLabel: function(cmp, event, helper) {
        var params = event.getParam('arguments');
        helper.executeControllerMethod(cmp, 'c.getLabel', {}, function(responseData) {
            if (params.callback) {
                params.callback(responseData || null);
            }
        });
    },

    handleGetPlugin: function(cmp, event, helper) {
        var params = event.getParam('arguments');
        helper.executeControllerMethod(cmp, 'c.getPlugin', {}, function(responseData) {
            if (params.callback) {
                params.callback(responseData || null);
            }
        });
    },

    handleSetLabel: function(cmp, event, helper) {
        var params = event.getParam('arguments');
        helper.executeControllerMethod(cmp, 'c.setLabel', { newLabel: params.newLabel }, function() {
            if (params.callback) {
                params.callback();
            }
        });
    }
});