({
    /**
     * `afterScriptsLoaded` handler
     *
     * @param {Object} cmp The Component object
     * @param {Object} event The associated event, if any
     * @param {Object} helper The Component's helper instance
     */
    afterScriptsLoaded: function(cmp, event, helper) {
        var isCommunity = !$A.util.isUndefinedOrNull($A.get('$Site'));

        cmp.set('v.selfOrigin', window.encodeURIComponent(window.location.protocol + '//' + window.location.host));
        cmp.set('v.vfPath', (isCommunity ? $A.get('$Site').coreUrlPrefix : '') + '/apex/');

        window.addEventListener('message', helper.getOnPostMessage(cmp));
    },

    /**
     * Directly instructs the iframe to render the given HTML or queues the markup to be rendered once
     * the iframe setup completes
     *
     * @param {Object} cmp The Component object
     * @param {Object} event The associated event, if any
     * @param {Object} helper The Component's helper instance
     */
    displayHtml: function(cmp, event, helper) {
        var args = event.getParam('arguments'),
            callback = args.callback,
            htmlContent = args.htmlContent;

        cmp.set('v.renderCallback', callback);
        helper.sendHtmlContent(cmp, htmlContent);
    }
})