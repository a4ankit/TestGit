({
    /**
     * Gets a greeting select option value/label pair
     * given a selected value
     *
     * @param {Object} cmp The Component instance
     * @param {String} selection The selection value from the select input
     */
    getGreetingOptionFromSelectionValue: function(cmp, selection) {
        var greetings = cmp.get('v.greetings');
        for (var index = 0; index < greetings.length; index = index + 1) {
            var option = greetings[index];
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