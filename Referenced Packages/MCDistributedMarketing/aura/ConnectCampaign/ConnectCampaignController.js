({
    init: function(cmp, event, helper) {
        helper.getInitialData(cmp);
    },

    saveJourneyLinkage: function(cmp, event, helper) {
        var callback = event.getParam && event.getParam('arguments').callback;
        helper.upsertJourneyLinkageRecord(cmp, callback);
    },

    handleSelectOption: function(cmp, event, helper) {
        helper.handleAutoCompleteSelection(cmp, event);
    },

    handleFetchDone: function(cmp, event, helper) {
        helper.handleAutoCompleteFetchDone(cmp, event);
    },

    handleApprovalFlowEnabledChanged: function(cmp, event, helper) {
        var hasJourneySelected = !!(cmp.find('autoComplete').get('v.value') || '').trim();

        helper.toggleSaveButton(cmp, {disabled: !hasJourneySelected});
    }
})