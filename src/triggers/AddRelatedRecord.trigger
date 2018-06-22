trigger AddRelatedRecord on Account(after insert, after update) 
{
    List<Opportunity> oppList = new List<Opportunity>();
    // Get the related opportunities for the accounts in this trigger
    // Add an opportunity for each account if it doesn't already have one.
    // Iterate through each account.
             for(Account a : [SELECT Id, Name FROM Account 
                              WHERE Id IN : Trigger.new
                              AND Id NOT IN(SELECT AccountId from Opportunity)]) 
             {
   //System.debug('acctsWithOpps.get(a.Id).Opportunities.size()=' + acctsWithOpps.get(a.Id).Opportunities.size());
        // Check if the account already has a related opportunity.
        //if (acctsWithOpps.get(a.Id).Opportunities.size() == 0) {
            // If it doesn't, add a default opportunity
            oppList.add(new Opportunity(Name=a.Name + ' Opportunity',
                                       StageName='Prospecting',
                                       CloseDate=System.today().addMonths(1),
                                       AccountId=a.Id));
             }           
   

    if (oppList.size() > 0)
    {
        insert oppList;
    }
}