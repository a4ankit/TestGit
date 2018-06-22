public class ContactSearch 
{
	public static List<Contact> searchForContacts(String s1, String s2)
    {
        List<Contact> c = new List<Contact>();
        c = [SELECT FirstName from Contact Where LastName=:s1 AND MailingPostalCode=:s2];
        return c;
    }
}