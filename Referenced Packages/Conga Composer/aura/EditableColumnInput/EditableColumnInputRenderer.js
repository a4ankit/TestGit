({
    afterRender: function(cmp, e, helper){
		this.superAfterRender();
		cmp.find('columnInput').getElement().children[1].children[0].focus();
	}
})