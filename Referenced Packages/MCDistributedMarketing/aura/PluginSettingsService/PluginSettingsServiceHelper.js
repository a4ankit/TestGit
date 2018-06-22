/* global $DM:false */
({
    executeControllerMethod: function(cmp, methodName, params, callback) {
        var action = cmp.get(methodName);
        action.setParams(params);
        action.setCallback(this, function(response) {
            if (!cmp.isValid() || response.getState() !== 'SUCCESS') {
                $DM.messages.showActionFailure(response, $A.get('$Label.mcdm_15.errorFetchingContent'));
                return;
            }

            if (callback) {
                callback(response.getReturnValue());
            }
        });

        $A.enqueueAction(action);
    }
})