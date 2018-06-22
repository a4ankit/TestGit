({
    /**
     * Handles the member selection change event via the
     * auto complete component
     *
     * @param {Object} cmp The Component instance
     * @param {Object} event The ui:dataProvide Event
     */
    handleMemberSelectionChanged: function(cmp, event) {
        var newMember = event.getParam('value'),
            oldMember = cmp.get('v.selectedMember');

        if (newMember.objectId !== oldMember.objectId) {
            cmp.set('v.selectedMember', newMember);
        }
    },

    /**
     * Handles the selectedMember attribute change event
     *
     * @param {Object} cmp The Component instance
     * @param  {Object} event The ui:dataProvide Event
     */
    handleSelectedMemberChanged: function(cmp, event, helper) {
        var selectedMember = cmp.get('v.selectedMember'),
            displayName = helper.formatDisplayName(selectedMember.firstName, selectedMember.lastName);

        cmp.find('memberAutocomplete').set('v.value', displayName);
        helper.debounceAction(cmp, function() {
            if (!cmp.isValid()) {
                return;
            }

            helper.fetchPersonalizationFields(cmp, function() {
                helper.updateEmailPreview(cmp);
            });
        });
    },

    handleActivityChanged: function(cmp, event, helper) {
        helper.debounceAction(cmp, function() {
            if (!cmp.isValid()) {
                return;
            }

            helper.updateEmailPreview(cmp);
        });
    },

    /**
     * Function tied to component method to trigger a preview update
     * @param  {Object}  cmp    The DataProvider Component
     * @param  {Object}  event  The ui:dataProvide Event
     * @param  {Object}  helper The Component's helper class
     */
    updateEmailPreview: function(cmp, event, helper) {
        helper.updateEmailPreview(cmp);
    }
})