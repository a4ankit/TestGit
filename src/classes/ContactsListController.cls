public class ContactsListController 
{
    public string cool {get; set;}
    private String sortOrder = 'FirstName';
    public List<Contact> getConta() 
    {
       
     List<Contact> results = Database.query(
        'SELECT Id, FirstName, LastName, Title, Email ' +
        'FROM Contact ' +
        'ORDER BY ' + sortOrder + ' asc ' +
        'LIMIT 100');
    return results;
        }
}