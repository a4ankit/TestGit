({
    navigateToJourneyApprovals: function(cmp) {
        var journeyDetails = cmp.get('v.journeyDetails');

        $A.get('e.force:navigateToComponent').setParams({
            componentDef: 'mcdm_15:JourneyApprovals',
            componentAttributes: {
                journeyId: cmp.get('v.journeyId'),
                campaignId: cmp.get('v.objectId'),
                objectBreadcrumbDetails: cmp.get('v.objectBreadcrumbDetails'),
                eventEntryKey: journeyDetails.eventEntryKey
            },
            isredirect: true
        }).fire();
    }
})