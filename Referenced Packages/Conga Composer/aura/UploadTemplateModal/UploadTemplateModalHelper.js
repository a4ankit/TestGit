({
	clearFields: function(cmp) {
		cmp.set("v.fileToUpload", null);
		cmp.find("templateName").set("v.value", null);
		cmp.find("templateGroup").set("v.value", null);
		cmp.find("templateDescription").set("v.value", null);
	},   
	serializeFile: function(cmp, files, helper) {
    	//Save the file contents to the component attribute so that we can upload when clicking save.
		cmp.set("v.dataFileToUpload", files);
		helper.showFile(cmp, files[0].name);
    },
    showFile: function(cmp, file) {
   		cmp.set("v.fileToUpload", file);
    },    
    showSpinner: function(cmp) {
        var spinnerEvent = cmp.getEvent("spinnerEvent");
        spinnerEvent.setParams({eventAction: "showSpinner"}).fire();
    },
	upload: function(cmp, file, fileContents, templateName, templateGroup, templateDescription, helper) {
        helper.callAction(cmp, cmp.get("c.saveTheFile"),{
            solutionId : cmp.get("v.solutionId"),
            fileName: file.name,
            base64Data: encodeURIComponent(fileContents), 
            contentType: file.type,
            templateName: templateName,
            templateGroup: templateGroup,
            templateDescription: templateDescription
        }).then(function(returnVal) {
            var templateEvent = cmp.getEvent("addTemplateEvent");
        	templateEvent.setParams({message: JSON.stringify(returnVal)}).fire();
        });
    },
    uploadFile: function(cmp, e, helper) {
    	//Input fields. Already validated in .cmp
        var templateName = cmp.find("templateName").get("v.value");
        var templateGroup = cmp.find("templateGroup").get("v.value");
        var templateDescription = cmp.find("templateDescription").get("v.value");
       
        //File upload logic
        var MAX_FILE_SIZE = 7500000; /* 10 000 000 * 3/4 to account for base64 */
		var fileInput = cmp.get("v.dataFileToUpload"); 

        if (fileInput == null || fileInput.length == 0) {
            alert('No file has been selected.')
            return;
        }
    	
        var file = fileInput[0];
    	if (file.size > MAX_FILE_SIZE) {
            alert('File size cannot exceed ' + MAX_FILE_SIZE + ' bytes.\n' +
    	          'Selected file size: ' + file.size);
    	    return;
        }
        this.closeModal(cmp);
        helper.showSpinner(cmp);
        var fr = new FileReader();
        
        fr.onload = function() {
            var fileContents = fr.result;
    	    var base64Mark = 'base64,';
            var dataStart = fileContents.indexOf(base64Mark) + base64Mark.length;
 
            fileContents = fileContents.substring(dataStart);
        	//Add the Conga Template record, attach the attachment to that record, and create the Conga Solution Template record.
    	    helper.upload(cmp, file, fileContents, templateName, templateGroup, templateDescription, helper);
        };
 
        fr.readAsDataURL(file);
    }
})