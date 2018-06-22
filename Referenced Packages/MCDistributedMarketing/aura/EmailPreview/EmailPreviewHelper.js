({
    /**
     * Fetches the preview from Marketing Cloud. Marketing Cloud does not sanitize HTML content, hence
     * it's "dirty"
     *
     * @param {Object} cmp The Component instance
     * @param {Object} emailData The object containing the `emailId` and `fieldMaps` needed to fetch the preview
     * @param {emailPreviewCallback} callback The callback that handles the response
     */
    getDirtyEmailPreview: function(cmp, emailData, callback) {
        var action = cmp.get('c.getContextualPreview');

        action.setParams({
            legacyEmailId: emailData.emailId,
            fieldMaps: emailData.fieldMaps
        });

        action.setCallback(this, function(response) {
            if (cmp.isValid() && response.getState() === 'SUCCESS') {
                var data = response.getReturnValue();

                cmp.set('v.emailPreview', data);
                callback(data.body);
            } else {
                callback(null, response.getError()[0].message);
            }
        });

        $A.enqueueAction(action);
    },

    /**
     * Sets the activity indicator and fires `previewStateChanged`
     *
     * @param {Object} cmp The Component instance
     * @param {Boolean} isLoading True to display activity, false to hide activity
     */
    setLoadingState: function(cmp, isLoading) {
        cmp.set('v.isLoading', isLoading);
        cmp.getEvent('previewStateChanged').fire();
    },

    /**
     * Checks if the preview being asked for is already displayed
     *
     * @param {Object} cmp The Component instance
     * @param {Object} requestedEmailData The object containing the `emailId` and `fieldMaps` to compare
     * @return {Boolean} True if the email data matches, otherwise false
     */
    isRequestedPreviewDisplayed: function(cmp, requestedEmailData) {
        var displayedEmailData = cmp.get('v.emailData'),
            emailIdsMatch = displayedEmailData.emailId === requestedEmailData.emailId,
            fieldMapsMatch = displayedEmailData.fieldMaps === requestedEmailData.fieldMaps;

        return emailIdsMatch && fieldMapsMatch;
    },

    /**
     * Initiates a request to fetch a preview.
     *
     * @param {Object} cmp The Component instance
     */
    fetchPreview: function(cmp) {
        var emailData = cmp.get('v.emailData');
        if (emailData && emailData.emailId) {
            cmp.set('v.errorMessage', null);
            this.setLoadingState(cmp, true);

            this.getDirtyEmailPreview(cmp, emailData, function(dirtyBody, errorMessage) {
                if (errorMessage) {
                    cmp.set('v.errorMessage', errorMessage);
                    this.setLoadingState(cmp, false);
                } else if (this.isRequestedPreviewDisplayed(cmp, emailData)) {
                    cmp.find('renderFrame').displayHtml(dirtyBody, function() {
                        this.setLoadingState(cmp, false);
                    }.bind(this));
                }
            }.bind(this));
        }
    }
})