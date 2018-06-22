({
    loadTemplates : function(cmp, helper) {
        helper.callAction(cmp, cmp.get("c.getAllTemplates"),
        {}
        ).then(function(returnVal) {
            //Good to go
            cmp.set("v.items", returnVal);
        });
    }
})