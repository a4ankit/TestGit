public class RandomContactFactory 
{
	public static List<Contact>generateRandomContacts(integer num, string Lname)
    {
        List<Contact> conList = new List<Contact>();
        {
            for(integer i=0;i<num;i++)
            {
                Contact con = new Contact(FirstName ='Test'+i, LastName= Lname);
                conList.add(con);
            }
        }
        return conList;
    }
}