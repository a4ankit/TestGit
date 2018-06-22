trigger ContactUpdate on Account (after update) 
{
    List<Contact> conList = [select id, Account.BillingStreet, Account.BillingCity, Account.BillingState, Account.BillingCountry,
                             Account.BillingPostalCode from contact WHERE AccountID IN : Trigger.new];
    for(Contact con : conList)
    {
        con.MailingStreet = con.Account.BillingStreet;
        con.MailingCity = con.Account.BillingCity;
        con.MailingCountry = con.Account.BillingCountry;
        con.MailingState = con.Account.BillingState;
        con.MailingPostalCode = con.Account.BillingPostalCode;
    }
    update conList; 
}