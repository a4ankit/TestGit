({
    fireAutoCompleteFetch: function(cmp, searchString, options) {
        cmp.set('v.isFetching', true);
        var dataProvider = cmp.get('v.dataProvider')[0];
        dataProvider.get('e.provide')
            .setParams({
                parameters: {
                    searchString: searchString,
                    clearResults: options.clearResults
                }
            }).fire();
    }
})