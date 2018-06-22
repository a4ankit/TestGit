({ init : function(cmp, e, helper) {
	var theme = cmp.get('v.theme');

	    //Set the correct video based upon ui
	    switch(theme) {
	    	case 'Theme4d':
	    	cmp.set("v.srcVal", "https://fast.wistia.net/embed/iframe/k8vk5w36qs?videoFoam=true");
	    	break;
	    	default:
	    	cmp.set("v.srcVal", "https://fast.wistia.net/embed/iframe/c2sr430jby?videoFoam=true");
	    	break;
	    }
	},
	saveModal: function(cmp, e, helper) {
		helper.closeModal(cmp);
	}
})