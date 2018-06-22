({
    init: function(cmp, event, helper) {
        helper.resetDirtyFlags(cmp);
        helper.fetchAndCreatePlugin(cmp);

        // Initialize the member-data-provider with the selected members.
        var dataProviderItems = cmp.get('v.members').map(function(record) {
            return {
                label: helper.formatDisplayName(record.firstName, record.lastName),
                value: record
            };
        });

        cmp.find('memberDataProvider').set('v.items', dataProviderItems);

        // Set the first member as the default selection.
        var firstItem = dataProviderItems.length && dataProviderItems[0];
        if (firstItem) {
            cmp.find('emailPreview').set('v.selectedMember', firstItem.value);
        }
    },

    applyChanges: function(cmp, event, helper) {
        cmp.find('messagePersonalization').applyChanges();
        cmp.find('sendSettings').applyChanges();
        helper.applyPluginCustomData(cmp);
        helper.resetDirtyFlags(cmp);
        helper.fireChangedEvent(cmp);

        helper.updatePreviewedSelectedMember(cmp);
        cmp.find('emailPreview').updateEmailPreview();
    },

    handleMessageP13nChanged: function(cmp, event, helper) {
        cmp.set('v.dirtyFlags.messageP13n', event.getParam('isDirty'));
        cmp.set('v.areP13nsValid', event.getParam('areP13nsValid'));
        helper.fireChangedEvent(cmp);
        event.stopPropagation();
    },

    handleSendSettingsChanged: function(cmp, event, helper) {
        cmp.set('v.dirtyFlags.sendSettings', event.getParam('isDirty'));
        helper.fireChangedEvent(cmp);
        event.stopPropagation();
    },

    /**
     * Handler for mcdm_15:JourneyApprovalsDataProvided events. Note that these events are fired from
     * Components outside of the Distributed Marketing package.
     *
     * @param {Object} cmp The Component instance
     * @param {Object} event The mcdm_15:JourneyApprovalsDataProvided event object
     * @param {Object} helper The Component's helper
     */
    handleDataProvided: function(cmp, event, helper) {
        var customData = cmp.get('v.pluginCustomData') || {};
        customData[event.getParam('id')] = event.getParam('data');

        cmp.set('v.pluginCustomData', customData);
        cmp.set('v.dirtyFlags.pluginCustomData', true);
        helper.fireChangedEvent(cmp);

        // prevent the event from being handled by global handlers
        event.stopPropagation();
        event.preventDefault();
    }
})