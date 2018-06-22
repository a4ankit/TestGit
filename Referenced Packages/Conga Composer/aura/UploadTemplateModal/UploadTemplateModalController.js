({
	onModalToggle : function (cmp,e, helper) {
		if(!e.getParam("value")) {
			helper.clearFields(cmp);
		}
	},
	filesAdded: function(cmp, e, helper) {
		var files = cmp.find("file").getElement().files;
		//Save the file contents to the component attribute so that we can upload when clicking save.
		helper.serializeFile(cmp, files, helper);
		//Show the file name to the user
		helper.showFile(cmp, files[0].name);
	},
    onDragOver: function(cmp, e) {
        event.preventDefault();
    },
    onDrop: function(cmp, e, helper) {
		event.stopPropagation();
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
        var files = event.dataTransfer.files;
        //Save the file contents to the component attribute so that we can upload when clicking save.
        helper.serializeFile(cmp, files, helper);
        //Show the file name to the user
		helper.showFile(cmp, files[0].name);
	},
	saveModal: function(cmp, e, helper) {
		var templateName = cmp.find("templateName").get("v.value");
		if (templateName != null) {
			if (templateName.trim() != "") {
				helper.uploadFile(cmp, e, helper);
			}
		}
		else {
			//If the templateName is empty, force the lightning:input element to show its error message.
			document.getElementsByName('templateName')[0].focus();
			document.getElementsByName('templateName')[0].blur();
		}
		
	}
})