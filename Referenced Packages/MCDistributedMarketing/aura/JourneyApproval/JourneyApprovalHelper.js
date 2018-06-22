({
    /**
     * Returns a localized full name
     *
     * @param {String} firstName The first name
     * @param {String} lastName The last name
     * @return {String} The localized full name
     */
    formatDisplayName: function(firstName, lastName) {
        var names = [lastName];

        if (firstName) {
            names[$A.get('$Locale.isEasternNameStyle') ? 'push' : 'unshift'](firstName);
        }

        return names.join(' ');
    },

    /**
     * Sets the `v.statusLabel` based on the given status
     *
     * @param {Object} cmp The Component instance
     * @param {String} status The status
     */
    setStatusLabel: function(cmp, status) {
        cmp.set('v.statusLabel', $A.get('$Label.mcdm_15.' + status.toLowerCase() + 'ApprovalStatus'));
    }
})