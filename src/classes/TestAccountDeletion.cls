@isTest
private class TestAccountDeletion 
{
	@isTest static void TestDeleteAccountWithOpportunity()
    {
        Account acct = new Account(Name='Test Account');
        insert acct;
        Opportunity opp = new Opportunity(Name = acct.name +'Opportunity',
                                          StageName = 'Prospecting',
                                          CloseDate = System.today().addMonths(1),
                                          AccountId = acct.Id);
       insert opp;
       Test.startTest();
       Database.DeleteResult result = Database.delete(acct, false);
       Test.stopTest();
       System.assert(!result.isSuccess());
       System.assert(result.getErrors().size()>0);
       System.assertEquals('Cannot delete account with related opportunities.',result.getErrors()[0].getMessage());
    }
}