/* global $DM:false */
({
    /**
     * Wraps the sending of html content via a message channel.
     *
     * @param {String} html The HTML content to display
     */
    sendHtmlContent: function(cmp, html) {
        if (!cmp.get('v.isIframeReady')) {
            cmp.set('v.queuedHtmlContent', html);
            return;
        }

        this._postMessage(cmp, {
            event: $DM.contentRenderer.constants.Messages.SET_HTML,
            data: html
        });
    },

    /**
     * Returns a callback for receiving the initial postMessage events from the iframe.
     *
     * @param {Object} cmp The Component instance
     * @return {Function} A callback suitable for handling postMessage events
     */
    getOnPostMessage: function(cmp) {
        return $A.getCallback(function(e) {
            if (!cmp.isValid() || !e.data
                || e.data.event !== $DM.contentRenderer.constants.Messages.IFRAME_READY) {
                return;
            }

            var messagePort = e.ports[0];
            messagePort.onmessage = function (message) {
                if (cmp.isValid() && message.data) {
                    cmp.find('htmlFrame').getElement().style.cssText
                        = 'height:' + message.data.data + 'px';

                    var callback = cmp.get('v.renderCallback');
                    if (callback) {
                        callback();
                    }
                }
            };

            cmp.set('v.isIframeReady', true);
            cmp.set('v.messagePort', messagePort);
            var queuedHtmlContent = cmp.get('v.queuedHtmlContent');
            if (!$A.util.isEmpty(queuedHtmlContent)) {
                cmp.set('v.queuedHtmlContent', '');
                this.sendHtmlContent(cmp, queuedHtmlContent);
            }
        }.bind(this));
    },

    /**
     * Convenience function to wrap sending of messages to the iframe via its message channel.
     *
     * @access private
     * @param {Object} data Data to transport via the message channel
     */
    _postMessage: function(cmp, data) {
        window.requestAnimationFrame($A.getCallback(function() {
            cmp.get('v.messagePort').postMessage(data);
        }));
    }
})