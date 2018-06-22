({
    init: function(cmp) {
        var objectMap = cmp.get('v.objectMap');
        cmp.set('v.iconName', 'standard:' + objectMap.objectType.toLowerCase());
    },

    handleSelectionChanged: function(cmp, event) {
        cmp.set('v.objectMap.fieldValue', event.getParam('value'));
    }
})