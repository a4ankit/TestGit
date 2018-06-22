public with sharing class CustomSettingsListController {

  public String selectedIso {get;set;}

  public List<selectOption> isoCodes {
    get {
      List<selectOption> options = new List<selectOption>();

      for (devsfdx__Country__c iso : devsfdx__Country__c.getAll().values())
        options.add(new SelectOption(iso.devsfdx__Capital__c,iso.Name+' - '+iso.devsfdx__Capital__c));
      return options;

    }
    set;
  }

}