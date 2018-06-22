/* global $DM:false */
({
    afterScriptsLoaded: function(cmp) {
        var action = cmp.get('c.query');
        action.setParams({
            objectType: cmp.get('v.objectType'),
            searchString: ''
        });

        action.setCallback(this, function(response) {
            if (!cmp.isValid() || response.getState() !== 'SUCCESS') {
                $DM.messages.showActionFailure(response, $A.get('$Label.mcdm_15.errorFetchingContent'));
            }

            var data = response.getReturnValue() || [];
            cmp.find('clientSideDataProvider').set('v.items', data);
        });

        $A.enqueueAction(action);
    },

    provide: function(cmp, event) {
        var params = event.getParams().parameters;
        if (!params) {
            return;
        }

        cmp.find('clientSideDataProvider').provideData(params.searchString, params.clearResults);
    }
})