({
    unrender: function(cmp, helper) {
        this.superUnrender();
        window.removeEventListener('message', helper.getOnPostMessage(cmp));
    }
})