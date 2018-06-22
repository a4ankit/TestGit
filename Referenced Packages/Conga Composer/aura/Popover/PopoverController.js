({
	closeDialog: function(cmp, event, helper) {
		helper.closePopup(cmp, helper);
		cmp.set("v.currentBreadCrumb", cmp.get("v.breadcrumbsArr[0]"));
	},
	handleBlurInputMergeField: function(cmp, event, helper) {
		helper.validateInputMergeField();
	},
	handleFocusInputMergeField: function(cmp, event, helper) {
		jQuery("input#inputMergeField").css({
			"outline": "0",
		    "border-color": "rgb(21, 137, 238)",
		    "background-color": "rgb(255, 255, 255)",
		    "box-shadow": "0 0 3px #0070d2"
		});
	},
	handleBreadcrumb: function(cmp, event, helper) {
		var index = event.currentTarget.getAttribute("data-step");
		var currentCrumbs = cmp.get("v.breadcrumbsArr");
		if(index + 1 >= currentCrumbs.length) { return; } //If final crumb don't don't anything
		var breadcrumb = currentCrumbs[index];
		cmp.set("v.currentBreadCrumb", breadcrumb);
		//Handles custom objects, look at a different way to do this
		if(index == 0) {
		    helper.setMetadataByName(cmp, cmp.get("v.masterObject"));
		}
		else {
		    helper.setMetadataByName(cmp, breadcrumb);
		}
		helper.removeBreadcrumbs(cmp, index);
		helper.scrollFieldSectionToTop();
		helper.clearSearch(cmp);
	},
	handleGetReferenceData : function (cmp, event, helper) {
		var referenceData = event.getSource().get("v.value");
		var referenceLabel = referenceData.fieldLabel;
		helper.setMetadataByName(cmp, referenceLabel);
		helper.addBreadcrumb(cmp, referenceData.fieldLabel);
		helper.scrollFieldSectionToTop();
		cmp.set("v.inputSObjectMetadata", "");
		cmp.set("v.currentBreadCrumb", referenceData.fieldLabel);
	},
	handlekeyupInputMergeField: function(cmp, event, helper) {
		helper.validateInputMergeField();
	},
	handleSearchSobjectMetadata: function(cmp, event, helper) {
		var input = cmp.get("v.inputSObjectMetadata");
		var re = new RegExp(input.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\\\$&"), "gi");
		var currentMetadataArrInit = cmp.get("v.currentMetadataArrInit");	
		var tempArr = [];
		for(var i=0; i<currentMetadataArrInit.length; i++) {
			if(currentMetadataArrInit[i].fieldLabel.match(re) || currentMetadataArrInit[i].fieldName.match(re) || currentMetadataArrInit[i].fieldType.match(re) || (currentMetadataArrInit[i].sampleData && currentMetadataArrInit[i].sampleData.match(re))) {
				tempArr.push(currentMetadataArrInit[i]);
			}
		}
		if(input) {
			cmp.set("v.currentMetadataArr", tempArr);
		} else {
			cmp.set("v.currentMetadataArr", cmp.get("v.currentMetadataArrInit"));
		}
	},
	handleSelectField: function(cmp, event, helper) {
		var index = event.currentTarget.getAttribute("data-step");
		var sObject = cmp.get("v.currentMetadataArr")[index];
		if(sObject.isExpandable) {return;}
		var $ele = jQuery("input#inputMergeField");
		var selectedText = $ele.val().substr($ele[0].selectionStart, $ele[0].selectionEnd-$ele[0].selectionStart);
		var inputValue = $ele.val();
		jQuery("div#inputMergeFieldValidationMessage").hide();
		var mergeField = sObject.mergeField;
		// if the User has selected text, then replace only the selected text with the merge field
		if(selectedText) {
			$ele.val(inputValue.replace(selectedText, mergeField)).focus();
		} else {
			// else find where the User's cursor is and insert the merge field
			var text = mergeField;
			var pos = 0;
			var browser = (($ele[0].selectionStart || $ele[0].selectionStart=="0") ? "ff" : (document.selection ? "ie" : false));
			if(browser==="ie") {
				$ele.focus();
				var range = document.selection.createRange();
				range.moveStart("character", -$ele.val().length);
				pos = range.text.length;
			} else if(browser==="ff") {
				pos = $ele[0].selectionStart;
			};
			var front = ($ele.val()).substring(0, pos);
			var back = ($ele.val()).substring(pos, $ele.val().length);
			$ele.val(front+text+back);
			pos = pos + text.length;
			if(browser==="ie") {
				$ele.focus();
				var range = document.selection.createRange();
				range.moveStart("character", -$ele.val().length);
				range.moveStart("character", pos);
				range.moveEnd("character", 0);
				range.select();
			} else if(browser==="ff") {
				$ele[0].selectionStart = pos;
				$ele[0].selectionEnd = pos;
				$ele.focus();
			}
		}
	},
	init: function(cmp, event, helper) {
		var masterObject = cmp.get("v.masterObject");
		var masterObjectLabel = cmp.get("v.masterObjectLabel");
		helper.addBreadcrumb(cmp, masterObjectLabel);
		helper.setMetadataByName(cmp, masterObject);
		cmp.set("v.currentBreadCrumb", masterObjectLabel);
	},
	insertMergeField: function(cmp, event, helper) {
		if(helper.validateInputMergeField()) {
			var replacementDataArr = cmp.get("v.replacementDataArr");
			var textMetadata = cmp.get("v.textMetadata");
			replacementDataArr.push(new helper.TemplateMergeField(textMetadata.text, jQuery("input#inputMergeField").val(), Number(textMetadata.occurrence), Number(textMetadata.page)));
			cmp.set("v.replacementDataArr", replacementDataArr);
			helper.closePopup(cmp, helper);
			cmp.getEvent("insertTextEvent").fire();
		} else {
			jQuery("input#inputMergeField").focus();
		}
	},
	reposition: function(cmp, e, helper) {
		helper.reposition(cmp, helper);
	},
	setPopoverValue: function(cmp, event, helper) {
		var params = event.getParam('arguments');
		if(params) {
			jQuery("input#inputMergeField").val(params.text).focus().select();
			cmp.set("v.textMetadata", params.textMetadata);
		}
	}
})