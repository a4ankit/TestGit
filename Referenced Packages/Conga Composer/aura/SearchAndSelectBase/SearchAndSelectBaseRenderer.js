({
	afterRender: function(cmp, helper){
		this.superAfterRender();
		cmp.find('searchInput').getElement().childNodes[1].setAttribute('autocomplete', 'off');
	}
})