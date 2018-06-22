public class ContactAndLeadSearch {
    public static List<List<SObject>> searchContactsAndLeads(String lastName)
    {
        
        List<List<SObject>> searchList = 
            [Find :lastName IN ALL FIELDS RETURNING Contact(FirstName,LastName),Lead(FirstName, LastName)];	        
        return searchList;
    }
    
    
}