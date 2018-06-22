/* global $DM:false */
({
    afterScriptsLoaded: function(cmp) {
        var getJourneyApprovalsLinkData = cmp.get('c.getJourneyApprovalsAttributeData');
        getJourneyApprovalsLinkData.setParams({recordId: cmp.get('v.recordId')});
        getJourneyApprovalsLinkData.setCallback(this, function(response) {
            if (!cmp.isValid() || response.getState() !== 'SUCCESS') {
                $DM.messages.showActionFailure(response, $A.get('$Label.mcdm_15.errorFetchingContent'));
                return;
            }

            var data = response.getReturnValue();
            if (data) {
                cmp.set('v.journeyId', data.journeyId);
                cmp.set('v.campaignId', data.objectId);
                cmp.set('v.eventEntryKey', data.eventEntryKey);
                cmp.set('v.objectBreadcrumbDetails', data.objectBreadcrumbDetails);
            }

            cmp.set('v.loading', false);
        });

        $A.enqueueAction(getJourneyApprovalsLinkData);
    }
})