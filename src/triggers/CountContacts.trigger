trigger CountContacts on Contact (after insert) 
{
    List<Contact> con = [SELECT Id, Name, Account.Name FROM Contact WHERE Id IN : Trigger.new];
    for(Contact co : con)
    {
        Account acc =[SELECT Id,(SELECT name FROM Contacts) FROM Account WHERE Name = : co.Account.Name];
        Integer count = acc.Contacts.size();
        System.debug('Contact related to account is'+count);
    }
}