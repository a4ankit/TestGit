({
    provide: function(cmp, event, helper) {
        var params = event.getParams().parameters;
        if (params) {
            if (params.clearResults) {
                helper.fireDataChangeEvent(cmp, []);
            } else if(!$A.util.isEmpty(params.searchString)) {
                helper.queryForJourneys(cmp, params.searchString);
            }
        }
    }
})