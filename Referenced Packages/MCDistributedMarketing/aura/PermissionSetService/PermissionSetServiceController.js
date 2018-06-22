({
    handleAllPermissions: function(cmp, event, helper) {
        helper.executeControllerMethod(cmp, event, 'c.getAllPermissions');
    },

    handleIsAdminUser: function(cmp, event, helper) {
        helper.executeControllerMethod(cmp, event, 'c.isAdminUser');
    },

    handleIsStandardUser: function(cmp, event, helper) {
        helper.executeControllerMethod(cmp, event, 'c.isStandardUser');
    }
})