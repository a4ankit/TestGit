({
  init : function(cmp, e, helper) {
    //Enable search
    cmp.set("v.enabled", true);
    //Get Conga_Templates and load into v.items
    helper.loadTemplates(cmp, helper);
        
  },
  addTemplate : function(cmp, e, helper) {
	  if(cmp.get("v.disabled")) {
		  return;
	  }
	  var data = e.currentTarget.dataset;
	  var templateEvent = cmp.getEvent("addTemplateEvent");
	  var templateData = {
			  "TemplateId" : data.templateid,
			  "TemplateGroup" : data.templategroup,
			  "Name" : data.templatename,
			  "Description" : data.templatedescription,
			  "LastModifiedDate" : data.lastmodifieddate,
			  "LastModifiedName" : data.lastmodifiedname
	  };
	  templateEvent.setParams({message: JSON.stringify(templateData)}).fire();
  }
})