({
	onBlur : function(cmp, e, helper) {
		if(helper.checkValidityAndFocus(cmp, "columnInput")) {
			helper.fireCloseEditEvent(cmp);
		}
		else {
			e.preventDefault();
		}
	},
	onKeyPress : function(cmp, e, helper) {
		if(e.which == 13 && helper.checkValidityAndFocus(cmp, "columnInput")) {
			helper.fireCloseEditEvent(cmp);
		}
	}
})