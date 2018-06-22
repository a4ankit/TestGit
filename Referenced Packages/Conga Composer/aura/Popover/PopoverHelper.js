({
	addBreadcrumb: function(cmp, crumbText) {
		var crumbs = cmp.get("v.breadcrumbsArr");
		crumbs.push(crumbText);
		cmp.set("v.breadcrumbsArr", crumbs);
	},
	closePopup: function(cmp, helper) {
		helper.clearSearch(cmp);
		helper.setMetadataByName(cmp, cmp.get('v.masterObject'));
		helper.scrollFieldSectionToTop();
		helper.removeBreadcrumbs(cmp, 0);
		cmp.set("v.isVisible", false);
	},
	clearSearch: function(cmp) {
		cmp.set('v.inputSObjectMetadata','');
	},
	position : function(cmp) {
	    // Adjust popover coordiantes from origin
	    var nubSize = 24; // Size of nubbin plus padding (popover arrow)
	    var element = cmp.find("popoverSection").getElement();
	    var height = element.clientHeight;
	    var width = element.clientWidth;
	    var windowWidth = window.innerWidth;
	    var windowHeight = window.innerHeight;
	    var minLeft = 200;
	    var targetX = cmp.get("v.targetX") || 0;
	    var targetY = cmp.get("v.targetY") || 0;
	    var targetHeight = (cmp.get("v.targetHeight") || 0) / 2;
	    targetX -= width / 2;
	    if (targetY + height + nubSize > windowHeight) {
	      // Show popover above text with callout at bottom
	      cmp.set("v.calloutDirection", "bottom");
	      targetY -= height + nubSize - targetHeight;
	      if (targetX + width > windowWidth) {
	        cmp.set("v.calloutDirection", "bottom-right");
	        targetX -= width/2 - nubSize;
	      }
	      else if (targetX < minLeft) {
	        cmp.set("v.calloutDirection", "bottom-left");
	        targetX += width/2 - nubSize;
	      }
	    }
	    else {
	      // Not enough space to display popover above text, show below text instead
	      targetY += nubSize + targetHeight;
	      cmp.set("v.calloutDirection", "top");
	      if (targetX + width > windowWidth) {
	        cmp.set("v.calloutDirection", "top-right");
	        targetX -= width/2 - nubSize;
	      }
	      else if (targetX < minLeft) {
	        cmp.set("v.calloutDirection", "top-left");
	        targetX += width/2 - nubSize;
	      }
	    }
	
	    if (targetY < 0 || (targetY + height + nubSize) > windowHeight) {
	      // Unable to display with callout without going offscreen, center on screen with no callout
	      cmp.set("v.calloutDirection", "none");
	      targetY = windowHeight / 2 - height / 2;
	      targetX = windowWidth / 2 - width / 2;
	    }
	    cmp.set("v.offsetX", parseInt(targetX));
	    cmp.set("v.offsetY", parseInt(targetY));
	    cmp.set("v.width", parseInt(width));
	    cmp.set("v.height", parseInt(height));
	},
	removeBreadcrumbs: function(cmp, index) {
		var currentCrumbs = cmp.get("v.breadcrumbsArr")
		var newCrumbs = currentCrumbs.slice(0, index+1);
		cmp.set("v.breadcrumbsArr", newCrumbs);
	},
	reposition: function(cmp, helper){
		setTimeout(this.safeCallback(cmp, function() {
			helper.position(cmp);
	    }));
	},
	safeCallback: function(component, fn) {
		// Return a Lightning callback that passes a component to a function if the component is still valid
		return $A.getCallback(function() {
	    	if (component.isValid()) {
	    	  fn.apply(null, arguments);
	    	}
	    });
  	},
	scrollFieldSectionToTop: function() {
		jQuery('div.section-maxheight').animate({scrollTop:0}, 'fast');
	},
	setMetadataByName : function (cmp, name) {
		var metadata = [];
		var model = cmp.get("v.masterDataArr");
		for(var i = 0; i< model.length; i++){ 
			if(model[i].sObjectName == name){
				metadata = model[i].FieldMetadataList;
				break;
			}
		}
		cmp.set("v.currentMetadataArr", metadata);
		cmp.set("v.currentMetadataArrInit", metadata);
	},
	TemplateMergeField: function(pDocumentTextToReplace, pMergeField, pOccurrenceOfTextInDocument, pPageNumber) {
		this.documentTextToReplace = pDocumentTextToReplace;
		this.mergeField = pMergeField;
		this.occurrenceOfTextInDocument = pOccurrenceOfTextInDocument;
		this.pageNumber = pPageNumber;
	},
	validateInputMergeField: function(cmp, event, helper) {
		var isValid = false;
		if(jQuery("input#inputMergeField").val()) {
			jQuery("div#inputMergeFieldValidationMessage").hide();
			jQuery("input#inputMergeField").css({
				"border": "1px solid rgb(217, 219, 221)",
				"box-shadow": "none"
			});
			isValid = true;
		} else {
			jQuery("input#inputMergeField").css({
				"background-color": "rgb(255, 255, 255)",
			    "border-color": "rgb(194, 57, 52)",
			    "box-shadow": "rgb(194, 57, 52) 0 0 0 1px inset"
			});
			jQuery("div#inputMergeFieldValidationMessage").show();
			isValid = false;
		}
		
		return isValid;
	}
})