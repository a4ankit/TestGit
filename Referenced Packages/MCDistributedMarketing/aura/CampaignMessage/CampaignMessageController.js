({
    /**
     * Handles the preview button click event.
     *
     * @param {Object} cmp The Component instance
     */
    handlePreviewButtonClick: function(cmp) {
        cmp.getEvent('previewRequested').fire();
    }
})