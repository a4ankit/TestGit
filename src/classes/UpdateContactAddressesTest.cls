@isTest
public class UpdateContactAddressesTest {
    
    @testSetup
    static void setup()
    {
        List<Account> accounts = new List<Account>();
        List<Contact> contacts = new List<Contact>();
        
        for(Integer i=0;i<10;i++)
        {
            accounts.add(new Account(name='Account'+i,  billingcity='New York', billingcountry='USA'));
        }
        insert accounts;
        
        for(Account account : [select id from account])
        {
            contacts.add(new contact(FirstName = 'first', LastName='last', accountid=account.Id ));
        }
        insert contacts;
    }
    static testmethod void test()
    {
        Test.startTest();
        UpdateContactAddresses uca = new UpdateContactAddresses();
        Id batchId = Database.executeBatch(uca);
        Test.stopTest();
    }
}