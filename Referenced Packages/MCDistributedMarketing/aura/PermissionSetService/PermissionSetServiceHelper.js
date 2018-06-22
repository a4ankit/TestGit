/* global $DM:false */
({
    /**
     * Executes the given server-side controller method
     *
     * @param {Object} cmp The Component instance
     * @param {Object} cmp The Event object
     * @param {String} methodName The method name to call on the server controller
     */
    executeControllerMethod: function(cmp, event, methodName) {
        var action = cmp.get(methodName),
            params = event.getParam('arguments');

        action.setParams(params);

        action.setCallback(this, function(response) {
            if (!cmp.isValid() || response.getState() !== 'SUCCESS') {
                $DM.messages.showActionFailure(response, $A.get('$Label.mcdm_15.errorFetchingContent'));
                return;
            }

            if (params.callback) {
                params.callback(response.getReturnValue());
            }
        });

        $A.enqueueAction(action);
    }
})