public class RemoveList 
{
	public Account objAccount {get;set;}
    public List<Contact> contactList{get;set;}
    public List<Contact> dltcontacts {get;set;}
    public RemoveList()
    {
        dltcontacts = new List<Contact>();
        objAccount = new Account();
        contactList = new List<Contact>();   
    }
    public void getDetails()
    {
        if(objAccount.ParentId != Null)
        {  
            for(Contact con : [select id,firstname, LastName, Email, Phone from Contact Where AccountId =:objAccount.ParentId])
            {
                contactList.add(con);
            }
            System.debug('ContactList--'+contactList.size());
        }
    }
}