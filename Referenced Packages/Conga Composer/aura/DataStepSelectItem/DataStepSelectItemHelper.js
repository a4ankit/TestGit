({
	previewTemplate : function(idtopreview) {
        window.open('/' + idtopreview, '_blank');
    },
	toggleView : function(cmp, shouldHide) {
    	cmp.set("v.hide", shouldHide);
    }
})