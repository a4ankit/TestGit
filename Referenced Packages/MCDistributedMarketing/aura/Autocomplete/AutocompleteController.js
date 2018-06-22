({
    init: function(cmp) {
        var dataProvider = cmp.get('v.dataProvider')[0];
        dataProvider.addEventHandler('onchange', cmp.getReference('c.handleDataChange'));
    },

    handleClearClick: function(cmp) {
        cmp.set('v.value', '');
    },

    handleDataChange: function(cmp) {
        cmp.set('v.isFetching', false);
    },

    handleInputChange: function(cmp, event, helper) {
        var newValue = event.getParam('value');
        if (!$A.util.isEmpty(newValue) || cmp.get('v.allowBlankSearches')) {
            helper.fireAutoCompleteFetch(cmp, newValue, { clearResults: false });
        }
    },

    handleFocus: function(cmp, event, helper) {
        if (cmp.get('v.allowBlankSearches') && $A.util.isEmpty(cmp.get('v.value'))) {
            helper.fireAutoCompleteFetch(cmp, '', { clearResults: false });
        }
    },

    handleSelectOption: function(cmp, event, helper) {
        if (event.getParam('isFooter') || event.getParam('isHeader')) {
            return;
        }

        var selection = event.getParam('option');
        cmp.set('v.value', selection.get('v.label'));

        cmp.getEvent('selectionChanged')
            .setParams({ value: selection.get('v.value') })
            .fire();

        helper.fireAutoCompleteFetch(cmp, '', { clearResults: true });
    },

    /**
     * Dummy Function as a workaround for autoComplete issues
     */
    doMatch: function() {}
})