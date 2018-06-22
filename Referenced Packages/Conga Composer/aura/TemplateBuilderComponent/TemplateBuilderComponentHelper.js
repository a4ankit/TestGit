({
	bytesToSize: function(bytes) {
		if(bytes == 0) return 0;
		var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
		return bytes / Math.pow(1024, i);
	},
	checkValidityAndFocus: function(cmp,auraId) {
		widget = cmp.find(auraId);
		widget.showHelpMessageIfInvalid();
		return widget.get("v.validity").valid;
	},
	disableDefaultBehavior: function(event) {
		event.preventDefault();
		event.stopPropagation();
	},
	getFiles: function(event) {
		if(event.dataTransfer && event.dataTransfer.files) {
			return event.dataTransfer.files
		} else if(event.target && event.target.files) {
			return event.target.files
		}
	},
	hideSpinner: function(cmp) {
		cmp.set("v.showSpinner", false);
	},
	loadpdf: function(cmp, event, pdfData) {
		try {
			jQuery("iframe#pdfFrame").show();
			jQuery("div#canvas-container").hide();
			if(typeof pdfData!="undefined") {
				cmp.find("pdfFrame").getElement().contentWindow.postMessage(pdfData, "*");
				cmp.getEvent("templateUploadEvent").fire();
			}
		} catch(e) {
			cmp.getSuper().find("toastComponent").showToast($A.get("$Label.apxtconga4.Toast_Title"), e.message, "error", "error");
		}
	},
	messageData: {},
	readFile: function(file, callback) {
		if(!file) {
			return;
		}
		if(!file.type.match(/(wordprocessingml.document.*)/)) {
			return callback(false);
		}
		var reader = new FileReader();
		reader.onloadend = $A.getCallback(function() {
			var dataURL = reader.result;
			var base64docx = dataURL.match(/,(.*)$/)[1];
			return callback(base64docx);
		});
		reader.readAsDataURL(file);
	},
	showPopover: function(cmp) {
		var viewer = cmp.find("pdfFrame");
		var yPosition = this.messageData.coords.y;
		var xPosition = this.messageData.coords.x;
        if (viewer) {
        	var viewerEl = viewer.getElement();
        	yPosition += viewerEl.offsetTop;
        	xPosition += viewerEl.offsetLeft;
        }
        var popoverCmp = cmp.find("popoverComp");
		popoverCmp.set("v.targetY", yPosition);
		popoverCmp.set("v.targetX", xPosition);
		popoverCmp.set("v.targetHeight", this.messageData.targetHeight);
		popoverCmp.reposition();
		cmp.set("v.isPopoverVisible", true);
		//SET COORDS
		popoverCmp.setPopoverValue(this.messageData.text, this.messageData);
	},
	showSpinner: function(cmp) {
		cmp.set("v.showSpinner", true);
	}
})