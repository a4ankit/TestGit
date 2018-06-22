({
    init: function(cmp) {
        var objectType = cmp.get('v.objectType');

        cmp.set('v.iconName', 'standard:' + objectType.toLowerCase());
    }
})