/* global $DM:false */
({
    afterScriptsLoaded: function(cmp) {
        var action = cmp.get('c.getJourneyDetailsFromSObject');
        action.setParams({ sObjectId: cmp.get('v.journeyId') });
        action.setCallback(this, function(response) {
            if (!cmp.isValid() || response.getState() !== 'SUCCESS') {
                $DM.messages.showActionFailure(response, $A.get('$Label.mcdm_15.errorFetchingContent'));
                return;
            }

            var items = response.getReturnValue().activities.map(function(activity) {
                return {
                    label: activity.Name,
                    value: activity
                };
            });

            cmp.set('v.items', items);
            cmp.set('v.activityCount', items.length);
            cmp.getEvent('asyncLoadComplete').fire();
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