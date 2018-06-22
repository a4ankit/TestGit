({
  SendWithDocuSign: function (component, event, helper) {
    var objectId = component.get("v.recordId");
    var namespacePrefix = component.get("v.docusignNamespace");
    var loggingEnabled = component.get("v.loggingEnabled");
    var url = window.location.protocol;
    url += "//";
    url += window.window.location.hostname;
    url += "/apex/";
    url += namespacePrefix;
    url += "DocuSign_CreateEnvelope?Lightning=1&DSEID=0&NW=1&SourceID=";
    url += objectId;
    if (loggingEnabled) {
      console.log("DSC Click: url = " + url);
    }
    window.open(url);
  },
  Init: function (component, event, helper) {
    var action = component.get("c.init");
    action.setCallback(this, function (response) {
      var state = response.getState();
      if (state === "SUCCESS") {
        var result = response.getReturnValue();
        component.set("v.docusignNamespace", result.namespacePrefix);
        component.set("v.loggingEnabled", result.isDebugLogEnabled);
        if (result.isDebugLogEnabled) {
          console.log("DSC init namespace: %s, logging: %s", result.namespacePrefix, result.isDebugLogEnabled);
        }
      }
      var loggingEnabled = component.get("v.loggingEnabled");
      if (state === "ERROR") {
        var errors = response.getError();
        if (errors) {
          if (errors[0] && errors[0].message) {
            if (loggingEnabled) {
              console.log("DSC init error: " + errors[0].message);
            }
          }
        } else {
          if (loggingEnabled) {
            console.log("DSC init error: unknown");
          }
        }
      }
    });
    $A.enqueueAction(action);
  }
});