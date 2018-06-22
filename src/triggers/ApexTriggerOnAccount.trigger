trigger ApexTriggerOnAccount on Account (after insert) 
{
    Account acct = new Account(Name='Ankit Sharma', Industry='Technology',Phone ='8130446391');
    insert acct;
    ID acctID=acct.ID;
    If(Trigger.isInsert)
    {
        Contact ank = new Contact(FirstName='Ankit', LastName='Sharma', Phone='9555894928', AccountId=acctID);
        insert ank;
    }
    
    
}