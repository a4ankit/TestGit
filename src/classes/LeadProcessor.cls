global class LeadProcessor implements Database.Batchable<SObject>, Database.Stateful
{
    global Database.QueryLocator start(Database.BatchableContext bc)
    {
        return Database.getQueryLocator('select lastname, status, LeadSource , Industry, Company from Lead');
        
    }
    global void execute(Database.BatchableContext bc, List<Lead> LeadSource)   
    {
        system.debug('LeadSource'+LeadSource); 
        List<Lead> leads = new List<Lead>();
        for(Lead lead : LeadSource)
        {
            lead.LeadSource='Dreamforce';
            leads.add(lead);
        }
        update leads;
    }
    global void finish(Database.BatchableContext bc)
    {
        AsyncApexJob job = [SELECT Id, Status, NumberOfErrors, 
                            JobItemsProcessed,
                            TotalJobItems, CreatedBy.Email
                            FROM AsyncApexJob
                            WHERE Id = :bc.getJobId()];
    }
}