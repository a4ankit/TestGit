({
    navigateToJourneyApprovals: function(cmp) {
        $A.get('e.force:navigateToSObject').setParams({
            recordId: cmp.get('v.linkedJourneyId')
        }).fire();
    }
})