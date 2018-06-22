({
	dragleave: function(cmp, event, helper) {
		helper.disableDefaultBehavior(event);
	},
	dragover: function(cmp, event, helper) {
		helper.disableDefaultBehavior(event);
	},
	drop: function(cmp, event, helper) {
		helper.disableDefaultBehavior(event);
		var files = helper.getFiles(event);
		if(files.length>1) {
			cmp.getSuper().find("toastComponent").showToast($A.get("$Label.apxtconga4.Toast_Title"), $A.get("$Label.c.Template_Builder_Too_Many_Files_Error"), "error", "error");
			return;
		}
		var fileSize = helper.bytesToSize(files[0].size);
		// limit fileSize to 2MB (2000KB)
		if(fileSize>2000) {
			cmp.getSuper().find("toastComponent").showToast($A.get("$Label.apxtconga4.Toast_Title"), $A.get("$Label.c.Template_Builder_File_Too_Large"), "error", "error");
			return;
		}
		cmp.set("v.fileType", files[0].name);
		var base64docx = helper.readFile(files[0], function(base64docx) {
			if(!base64docx) {
				cmp.getSuper().find("toastComponent").showToast($A.get("$Label.apxtconga4.Toast_Title"), $A.get("$Label.c.Template_Builder_Incorrect_File_Type_Error"), "error", "error");
				return;
			}
			helper.showSpinner(cmp);
			helper.callAction(cmp, cmp.get("c.convertToPdf"), {
				base64Data: base64docx
			}).then(function(returnVal) {
				helper.hideSpinner(cmp);
				var response = JSON.parse(returnVal);
				var base64pdf = response.results[0].uint8data;
				cmp.set("v.base64String", base64docx);
				helper.loadpdf(cmp, event, base64pdf);
			}).catch(function(err) {
				cmp.getSuper().find("toastComponent").showToast($A.get("$Label.apxtconga4.Toast_Title"), "Error loading file.", "error", "error");
				return;
			});
		});
	},
	handleLoadPdf: function(cmp, event, helper) {
		helper.showSpinner(cmp);
		helper.callAction(cmp, cmp.get("c.convertToPdf"), {
			base64Data: cmp.get("v.base64String")
		}).then(function(returnVal) {
			var responseObj = JSON.parse(returnVal);
			var base64pdf = $A.util.json.encode(responseObj.results[0].uint8data);
			var regex = new RegExp('"', "g");
			base64pdf = base64pdf.replace(regex, "");
			helper.hideSpinner(cmp);
			helper.loadpdf(cmp, event, base64pdf);
		}).catch(function(err) {
			cmp.getSuper().find("toastComponent").showToast($A.get("$Label.apxtconga4.Toast_Title"), "Error loading file.", "error", "error");
			return;
		});
	},
	init: function(cmp, event, helper) {
		helper.showSpinner(cmp);
		var solutionId = cmp.get("v.solutionId");
		if(solutionId) {
			var action = cmp.get("c.getSolutionDetails");
			helper.callAction(cmp, action, {
				solutionId: solutionId
			}).then(function(result) {
				cmp.set("v.sampleRecordId", result.sampleRecordId);
				 helper.callAction(cmp, cmp.get("c.getObjectMetadata"), {
		        	sampleRecordId: cmp.get("v.sampleRecordId"),
		        	sObjectName: cmp.get("v.masterObject")
		        }).then(function(returnVal) {
		        	cmp.set("v.MasterDataArr", JSON.parse(returnVal));
		        	cmp.find("popoverComp").initPopover();
		        	helper.hideSpinner(cmp);
		        });
			});
		}
		document.getElementsByTagName("html")[0].style.height = "100%";
		document.getElementsByTagName("body")[0].style.height = "100%";
		// the iframe's postMessage() event listener receives message from static resource: lcins1_pdfjs file: delegates.js
		window.addEventListener("message", function(e) {
			var messageData = JSON.parse(e.data);
			helper.messageData = messageData;
			helper.showPopover(cmp);
		});
	}
})