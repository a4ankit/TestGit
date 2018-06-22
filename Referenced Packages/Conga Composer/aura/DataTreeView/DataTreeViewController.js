({
  init : function(cmp, e, helper) {
    var relatedAction = cmp.get("c.getRelatedLists");
    var apiName = cmp.get("v.masterObject");

    relatedAction.setStorable();
    relatedAction.setParams({
      apiName: apiName
    });
    var tree = [
    {
      label:"Related List",
      items:[{}],
      action: relatedAction
    },
    {
      label: "Parent/Lookup Relationships",
      items:[{}]
    },
    {
      label: "Add Existing Conga Query",
      items:[{}]
    }];
    cmp.set("v.items", tree);
  }
})