({
  init : function(component, event, helper) {
    var tree = [{
      label: "George",
      items: [{
        label:"Steinbrenner"
      },
      {
        label:"Susan"
      },
      {
        label:"Frank"
      },
      {
        label:"Kruger"
      }]
    },
    {
      label:"Jerry",
      items: [{
        label:"Uncle Leo",
        items: [{
          label:"Cousin Jeffery"
        }]
      },
      {
        label:"Morty"
      }]
    },
    {
      label:"Kramer",
      items: [{
        label:"Newman"
      },
      {
        label:"Babbs"
      },
      {
        label:"Bob Sacamano"
      }]
    },
    {
      label: "Elaine",
      items: [{
        label:"Puddy"
      },
      {
        label:"Mr. Pitt"
      },
      {
        label:"J. Petterman"
      }]
    }];
    component.set("v.items", tree);
  },
  searchKeyChange: function(component, event, helper) {
        /*var myEvent = $A.get("e.APXTConga4:SearchKeyChange");
        myEvent.setParams({"searchKey": event.target.value});
        myEvent.fire();*/
        var returnStrArray = [""];
        for (var i = 0, l = component.get("v.items").length; i < l; i++) {
            var obj = component.get("v.items")[i];
            if (JSON.stringify(obj).toLowerCase().includes(event.target.value.toLowerCase())){
              returnStrArray.push(obj);
              //returnStr = returnStr + ' , ' + JSON.stringify(obj);
              //alert(JSON.stringify(obj).toLowerCase() + ' ' + event.target.value.toLowerCase() + ' ' + JSON.stringify(obj).toLowerCase().includes(event.target.value.toLowerCase()));
            
        }
           /* for (var j = 0, z = obj.length; j < z; i++) {
              var obj2 = obj[j];
              if (JSON.stringify(obj2).includes(event.target.value)){
              returnStr = returnStr + ' , ' + JSON.stringify(obj2);
            }
            }*/
        }
        //Change the searchedItems attribute to an array, like items
        component.set("v.searchedItems", returnStrArray);
        //alert(returnStr);
        //alert(JSON.stringify(component.get("v.items")).includes(event.target.value));
        //alert(component.get("v.items"));
    },
  updateCheckboxes : function(component, event) {
    alert(JSON.stringify(event.currentTarget.id));

    var action = component.get("c.getInsertSolutionTemplate");
        
          action.setParams({
              IdToInsert : event.currentTarget.id
          });
          
          action.setCallback(this,function(response){
              var state = response.getState();
              
              if(state === 'SUCCESS'){
                alert(state);
                // This event will bubble up to parent
          /*var event = component.getEvent("stepEvent");
            event.setParams({
              eventAction: "refreshList"
          }).fire();*/
                  
              }else if (state === "ERROR") {
                  console.log('Error');
              }
          });
          $A.enqueueAction(action);


  }
})