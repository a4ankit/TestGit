function handleError(response, cmp) {
$A.createComponents([
                ["ui:message",{
                    "title" : "Error In Operation",
                    "severity" : "error",
                }],
                ["ui:outputText",{
                    "value" : response
                }]
                ],
                function(components, status, errorMessage){
                	var errorDiv = cmp.find("errorDiv");
                    if (status === "SUCCESS") {
                        var message = components[0];
                        var outputText = components[1];
                        console.log("Error: " + errorMessage);
                        // set the body of the ui:message to be the ui:outputText
                        message.set("v.body", outputText);
				        // Replace div body with the dynamic component
				        errorDiv.set("v.body", message);
                    }
                    else if (status === "INCOMPLETE") {
                        console.log("No response from server or client is offline.")
				        // Replace div body with the dynamic component
				        errorDiv.set("v.body", "No response from server or client is offline.");
                    }
                    else if (status === "ERROR") {
                        console.log("Error: " + errorMessage);
				        // Replace div body with the dynamic component
				        errorDiv.set("v.body", "Error: " + errorMessage);
                    }
                }
            );
}