({
    isStandardUser: function(cmp, callback) {
        var action = cmp.get('c.isStandardUser');

        action.setCallback(this, function(response) {
            if (cmp.isValid() && response.getState() === 'SUCCESS') {
                callback(response.getReturnValue());
            }
        });

        $A.enqueueAction(action);
    }
})