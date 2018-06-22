({
    /**
     * Gets a greeting select option value/label pair
     * given a selected value
     *
     * @param {Object} cmp The Component instance
     * @param {String} selection The selection value from the select input
     */
    getGreetingOptionFromSelectionValue: function(cmp, selection) {
        var greetings = cmp.get('v.greetings'),
            len, i;

        for (i = 0, len = greetings.length; i < len; i += 1) {
            var option = greetings[i];

            if (option.value === selection) {
                return {
                    value: option.value,
                    label: option.label
                };
            }
        }

        return null;
    }
})