({
    afterScriptsLoaded: function(cmp, event, helper) {
        helper.fetchAllIds(cmp);
    },

    provide: function(cmp, event, helper) {
        helper.fetchNextPage(cmp);
    }
})