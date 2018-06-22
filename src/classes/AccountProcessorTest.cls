@isTest
private class AccountProcessorTest
{
    @isTest
    private static void countContact()
    {
        Account acc = new Account(Name = 'Test Account');
        insert acc;
        
        Contact con = new Contact(FirstName = 'Test',
                                  LastName ='Test',
                                  Email= 'demo@exapmle.com',
                                  AccountId=acc.id);
        insert con;
        List<Id> ids = new List<Id>();
        ids.add(acc.id);
        Test.startTest();
        AccountProcessor.countContacts(ids);
        Test.stopTest();
        
    }
}