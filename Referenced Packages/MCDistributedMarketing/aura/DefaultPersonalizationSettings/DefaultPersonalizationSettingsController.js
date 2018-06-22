({
    init: function(cmp, event, helper) {
        cmp.set('v.isLoading', true);

        helper.getSendSettingData(cmp, function() {
            cmp.set('v.isLoading', false);
        });
    },

    applyChanges: function(cmp, event, helper) {
        var callback = event.getParam && event.getParam('arguments').callback;
        cmp.set('v.isLoading', true);

        helper.applyDefaultJourneySendSettings(cmp, function(){
            cmp.set('v.isLoading', false);
            if(typeof callback === 'function') {
                callback();
            }
        });
    }
})