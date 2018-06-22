({
	initializeForm : function(cmp, helper) {
		var solutionId = cmp.get("v.solutionId");
		if( (solutionId == null) || (solutionId == "") ) {
			return;
		}
		cmp.set("v.showSpinner", true);
		this.callAction(cmp, cmp.get("c.getFileSettingParameters"),
			{solutionId : solutionId}
		).then(function(returnVal) {
			if( (returnVal.ConvertToPdf == null) || (returnVal.ConvertToPdf == "0") || (returnVal.ConvertToPdf == "") ) {
				cmp.set("v.convertToPdf", false);
			} else {
				cmp.set("v.convertToPdf", true);
			}
			if( (returnVal.IsMandatory == null) || (returnVal.IsMandatory == "0") || (returnVal.IsMandatory == "") ) {
				cmp.set("v.isMandatory", false);
			} else {
				cmp.set("v.isMandatory", true);
			}
			var filename = returnVal.Filename;
			if(filename != null) {
				filename = decodeURI(filename);
			}
            cmp.set("v.filename", filename);
            cmp.set("v.showSpinner", false);
        });
	}
})