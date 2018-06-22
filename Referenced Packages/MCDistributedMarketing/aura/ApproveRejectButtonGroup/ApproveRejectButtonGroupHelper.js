({
    /**
     * Fires the `ui:menuSelect` event
     *
     * @param {Object} cmp The Component instance
     * @param {String} status The selected status value
     */
    fireMenuSelect: function(cmp, status) {
        cmp.getEvent('select').setParams({selectedItem: status}).fire();
    }
})