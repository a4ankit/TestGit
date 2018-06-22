/* global $DM:false */
({
    /**
     * Fires a personalization changed event to indicate that changes have been made to this or a
     * child component's state.
     *
     * @param {Object} cmp The Component instance
     */
    fireChangedEvent: function(cmp) {
        var isDirty = $DM.values(cmp.get('v.dirtyFlags')).some(function(val) {
            return val;
        });

        cmp.getEvent('personalizationChanged')
            .setParams({
                isDirty: isDirty,
                areP13nsValid: cmp.get('v.areP13nsValid')
            })
            .fire();
    },

    /**
     * Resets all dirty flags pertaining to child component states.
     *
     * @param {Object} cmp The Component instance
     */
    resetDirtyFlags: function(cmp) {
        cmp.set('v.dirtyFlags', {
            sendSettings: false,
            messageP13n: false
        });
    }
})