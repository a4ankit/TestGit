global class CreateAccountRecordsBatch implements database.Batchable <sObject>
{
    global string query;
    global Integer recordsProcessed = 0;
    global CreateAccountRecordsBatch(){
        
    }
    global database.QueryLocator start(database.BatchableContext bc)
    {
        query = 'select id from account limit 10';
        system.debug('query--->'+query);
        return database.getQueryLocator(query);
        
    }
    global void execute(database.BatchableContext bc, List<Account> records)
    {
        list<Account> accList = new list<Account>();
        system.debug('records'+records);
        for(Account acc:records)
        {
            Account obj = new Account(Name='Test');
            accList.add(obj);
        }
        insert accList;
        system.debug('accList--->'+accList);
        system.debug('records'+records);
    }
    global void finish(database.BatchableContext bc)
    {
        System.debug(recordsProcessed + ' records processed. Shazam!');
        AsyncApexJob job = [SELECT Id, Status, NumberOfErrors, 
                            JobItemsProcessed,
                            TotalJobItems, CreatedBy.Email
                            FROM AsyncApexJob
                            WHERE Id = :bc.getJobId()];
        
    }
}