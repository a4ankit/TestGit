/* global $DM:false */
({
    queryForJourneys: function(cmp, journeyName) {
        var action = cmp.get('c.queryForJourneys'),
            pageSize = cmp.get('v.pageSize');

        action.setParams({
            pageSize: pageSize,
            journeyQueryValue: journeyName
        });

        action.setCallback(this, function(response) {
            var data = response.getReturnValue() || [];

            if (!cmp.isValid() || response.getState() !== 'SUCCESS') {
                $DM.messages.showActionFailure(response, $A.get('$Label.mcdm_15.errorFetchingContent'));
            }

            data.map(function(item) {
                item.visible = true;
            });

            this.fireDataChangeEvent(cmp, data);
        });

        $A.enqueueAction(action);
    },

    /**
     * Fires the event to update the Autocomplete List
     * @param  {Object} cmp  The Component
     * @param  {Object[]} data The list of options
     */
    fireDataChangeEvent: function(cmp, data) {
        var dataChangeEvent = cmp.getEvent('onchange');
        dataChangeEvent.setParams({
            data: data
        }).fire();
    }
})