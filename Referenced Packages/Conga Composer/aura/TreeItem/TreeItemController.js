({
  init: function(cmp, e, helper) {
  },
  select: function(cmp, e, helper) {
    if (cmp.get("v.hasItems")) {
      var action = cmp.get("v.action");
      if (action) {
        // Dyanmic sub items, run apex action
        helper.callAction(cmp, action)
        .then(function(results) {
          // Set items then expand
          cmp.set("v.items", results);
          cmp.set("v.isExpanded", !cmp.get("v.isExpanded"));
        })
        .catch(function(err) {
          throw err;
        });
      }
      else {
        // Static sub items
        cmp.set("v.isExpanded", !cmp.get("v.isExpanded"));
      }
    }
  }
})