public class ObjectList 
{
    public Account objAccount {get;set;} 
    public List<WrapContact> contactList{get;set;}
    public ObjectList()
    {
        objAccount = new Account();
        contactList = new List<WrapContact>();
    }
    public void getDetails()
    {
        contactList =new List<WrapContact>();
        system.debug('#######'+objAccount.ParentId);
        if(objAccount.ParentId != Null)
        {              
            for(Contact c : [select id,firstname, LastName, Email, Phone,Account.ParentId from Contact Where AccountId =:objAccount.ParentId])
            {
                contactList.add(new WrapContact(c,false));    
                System.debug('ContactList--'+contactList.size());
            }
        }
        else
        {    
        }
    }
    public void DeleteChecked()
    {   
        List<WrapContact> contactList1 = contactList.clone();
        for(WrapContact wrapContactObj: contactList1)
        {
            system.debug('wrapContactObj'+wrapContactObj);
            if(wrapContactObj.checked==True)
            {      
                contactList.remove(contactList.indexOf(wrapContactObj));    
            }   
        }
    }
    public class WrapContact
    {
        public boolean checked {get;set;}
        public Contact con {get;set;}
        public WrapContact(Contact c,boolean check)
        {        
            con=c;
            checked=check;
        }        
    }
}