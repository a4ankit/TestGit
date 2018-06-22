trigger UpdateContactAdd on Account (after update) 
{
    List<Contact> contactList = new List<Contact>();
    List<Account> accList = [SELECT ID, BillingStreet, BillingCity, BillingState, BillingCountry,
                             BillingPostalCode, (SELECT ID, MailingStreet, MailingCity,MailingCountry, 
                                                 MailingState, MailingPostalCode FROM Contacts) FROM Account WHERE ID IN : Trigger.New];
    
    for(Account acc : accList)
    {
        for(Contact con : acc.Contacts)     
        {
            con.MailingStreet = acc.BillingStreet;
            con.MailingCity = acc.BillingCity;
            con.MailingCountry = acc.BillingCountry;
            con.MailingState = acc.BillingState;
            con.MailingPostalCode = acc.BillingPostalCode;
            contactList.add(con);
        }
    }
    update contactList;
}