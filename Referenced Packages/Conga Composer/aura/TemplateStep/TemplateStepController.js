({
    handleEmailEvent: function(cmp, event, helper) {
    	helper.handleCreateComponent(cmp, event, "APXTConga4:EmailTemplateBuilder");
    },
    handleTemplateBuilderEvent: function(cmp, event, helper) {
    	helper.handleCreateComponent(cmp, event, "APXTConga4:TemplateBuilder");
    },
    init: function(cmp, event, helper) {
    	helper.handleCreateComponent(cmp, event, "APXTConga4:TemplateManagement");
    }
})