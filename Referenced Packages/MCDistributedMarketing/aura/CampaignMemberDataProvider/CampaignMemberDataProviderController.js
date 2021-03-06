/* global $DM:false */
({
    afterScriptsLoaded: function(cmp) {
        var action = cmp.get('c.query');
        action.setParams({
            campaignId: cmp.get('v.campaignId'),
            nameSearch: ''
        });

        action.setCallback(this, function(response) {
            if (!cmp.isValid() || response.getState() !== 'SUCCESS') {
                $DM.messages.showActionFailure(response, $A.get('$Label.mcdm_15.errorFetchingContent'));
            }

            cmp.find('clientSideDataProvider').set('v.items', response.getReturnValue() || []);
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