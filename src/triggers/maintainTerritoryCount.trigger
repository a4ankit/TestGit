trigger maintainTerritoryCount on Territory2 (after insert, after delete) 
{
    // Track the effective delta for each model
    Map<Id, Integer> modelMap = new Map<Id, Integer>();
    for(Territory2 terr : (Trigger.isInsert ? Trigger.new : Trigger.old)) 
    {
        Integer offset = 0;
        if(modelMap.containsKey(terr.territory2ModelId)) 
        {
            offset = modelMap.get(terr.territory2ModelId);
        }
        offset += (Trigger.isInsert ? 1 : -1);
        modelMap.put(terr.territory2ModelId, offset);
    }
    // We have a custom field on Territory2Model called TerritoryCount__c
    List<Territory2Model> models = [SELECT Id, devsfdx__TerritoryCount__c FROM 
                                    Territory2Model WHERE Id IN :modelMap.keySet()];
    for(Territory2Model tm : models) 
    {
        // In case the field is not defined with a default of 0
        if(tm.devsfdx__TerritoryCount__c == null) 
        {
            tm.devsfdx__TerritoryCount__c = 0;
        }
        tm.devsfdx__TerritoryCount__c += modelMap.get(tm.Id);
    }
    // Bulk update the field on all the impacted models
    update(models);
}