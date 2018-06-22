({
    /**
     * Filter the list of items based on the searchString or clears List if flag is set
     * @param  {Object}  cmp    The DataProvider Component
     * @param  {String}  query  The String being searched for
     * @param  {Object}  options  Search options {clearResults: Boolean}
     */
    provide: function(cmp, query, options) {
        if (options.clearResults) {
            this.fireDataChangeEvent(cmp, []);
        } else {
            var items = cmp.get('v.items'),
                maxResults = cmp.get('v.maxResults'),
                sortResults = cmp.get('v.sortResults'),
                searchString = query || '',
                regExp = new RegExp(searchString, 'i');

            var allMatches = items.filter(function(item) {
                return !searchString.length || item.label.search(regExp) !== -1;
            });

            cmp.set('v.totalResultSize', allMatches.length);
            var results = allMatches;
            if (sortResults) {
                results.sort(function(a, b) {
                    return a.label.localeCompare(b.label);
                });
            }

            if (maxResults) {
                results = results.slice(0, Math.min(maxResults, results.length));
            }

            results = results.map(function(item) {
                return {
                    visible: true,
                    label: item.label,
                    value: item.value,
                    keyword: searchString
                };
            });

            this.fireDataChangeEvent(cmp, results);
        }
    },

    /**
     * Fires the event to update the Autocomplete List
     * @param  {Object} cmp  The Component
     * @param  {Object[]} data The list of options
     * @param  {String} data[].label The label for the option displayed to the user
     */
    fireDataChangeEvent: function(cmp, data) {
        var dataChangeEvent = cmp.getEvent('onchange');
        dataChangeEvent.setParams({
            data: data
        }).fire();
    }
})