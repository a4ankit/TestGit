global class AccountProcessor 
{
    @future
    public static void countContacts(List<Id> recordIds)
    {
        for(Account accounts : [select id from account where id in : recordIds])
        {
            integer contactcount =0;
            contactcount= [select Count() from contact where  Contact.AccountId= :accounts.id];
            accounts.Number_of_Contacts__c=contactcount;
            update accounts;
         
        }    
    }
}