({
    afterScriptsLoaded: function(cmp) {
        cmp.set('v.multiValueFlags', {});
        cmp.set('v.p13nValidationMap', {});
    },

    applyChanges: function(cmp, event, helper) {
        helper.save(cmp);
    },

    handleUndoClick: function(cmp, event, helper) {
        helper.reset(cmp);
    },

    handlePrevMessageClick: function(cmp, event, helper) {
        helper.setSelectedActivity(cmp, cmp.get('v.activityIndex') - 1);
    },

    handleNextMessageClick: function(cmp, event, helper) {
        helper.setSelectedActivity(cmp, cmp.get('v.activityIndex') + 1);
    },

    handleIntroductionChanged: function(cmp, event, helper) {
        if (cmp.get('v.ignoreFieldChanges')) {
            return;
        }

        helper.setP13nFieldFromAttribute(cmp, 'v.intro');
    },

    handleClosingChanged: function(cmp, event, helper) {
        if (cmp.get('v.ignoreFieldChanges')) {
            return;
        }

        helper.setP13nFieldFromAttribute(cmp, 'v.closing');
    },

    handleMessageDataProviderLoaded: function(cmp, event, helper) {
        helper.initializeP13nStates(cmp);

        // Set the activity to the first one only if one is not set already
        var selectedActivity = cmp.get('v.selectedActivity');
        var activityIndex = selectedActivity ? helper.getActivityIndex(cmp, selectedActivity.Id) : 0;
        helper.setSelectedActivity(cmp, activityIndex);

        cmp.set('v.isLoading', false);
    },

    handleMessageSelectionChanged: function(cmp, event, helper) {
        var newActivity = event.getParam('value'),
            oldActivity = cmp.get('v.selectedActivity');

        /* This is the only place where 'Id' instead of 'EmailId' is used so that we can properly update the selection */
        if (newActivity.Id !== oldActivity.Id) {
            helper.setSelectedActivity(cmp, helper.getActivityIndex(cmp, newActivity.Id));
        }
    },

    handleMultiValueMessageClick: function(cmp, event) {
        var localId = event.currentTarget.getAttribute('data-localId');
        cmp.find(localId).focus();
    }
})