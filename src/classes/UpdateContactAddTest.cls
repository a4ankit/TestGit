@isTest
public class UpdateContactAddTest 
{
	@isTest static void myTest()
    {
        Account accounts = new Account(name='Account',  billingcity='New York', 
                                       billingcountry='USA', billingstate='', billingPostalCode='1211214');
        
        insert accounts;
        
        Contact contacts = new contact(FirstName = 'first', LastName='last', accountid=accounts.Id);
        
        insert contacts;
        
        Test.startTest();
        Database.SaveResult result = Database.update(accounts, false);
        Test.stopTest();
        
    }
}