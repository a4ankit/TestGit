({
    /**
     * This will get called upon a ui:dataProvide event triggered on the dataProvider
     * Filter the list of items based on the searchString or clears List if flag is set
     * @param  {Object}  cmp    The DataProvider Component
     * @param  {Object}  event  The ui:dataProvide Event
     * @param  {Object}  helper Helper for the Component
     */
    handleProvideEvent: function(cmp, event, helper) {
        var params = event.getParams().parameters;
        if (!params) {
            return;
        }

        helper.provide(cmp, params.searchString, { clearResults: params.clearResults });
    },

    provideData: function(cmp, event, helper) {
        var args = event.getParam('arguments');
        helper.provide(cmp, args.searchString, { clearResults: args.clearResults });
    }
})