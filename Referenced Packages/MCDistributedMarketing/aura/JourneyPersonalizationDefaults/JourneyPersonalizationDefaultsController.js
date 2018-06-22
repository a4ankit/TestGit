({
    afterScriptsLoaded: function(cmp, event, helper) {
        helper.resetDirtyFlags(cmp);
    },

    applyChanges: function(cmp, event, helper) {
        cmp.find('messagePersonalization').applyChanges();
        cmp.find('sendSettings').applyChanges();
        cmp.find('emailPreview').updateEmailPreview();
        helper.resetDirtyFlags(cmp);
        helper.fireChangedEvent(cmp);
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
    }
})