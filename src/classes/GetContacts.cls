public class GetContacts 
{
    
    public boolean display{get; set;}
    
    Public void getContactList(){
        
        display = true;
    }
    public List<Contact> contactList()
    {
        List<Contact> getCon = [select id ,name, Email, Phone from Contact];
        
        return getCon;
    }
    
}