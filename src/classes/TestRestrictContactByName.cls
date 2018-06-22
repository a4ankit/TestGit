@isTest
public class TestRestrictContactByName 
{
	@isTest static void testContact()
    {
        Contact con = new Contact(LastName = 'INVALIDNAME');
        Database.saveResult save = Database.insert(con, false);
        System.assert(!save.isSuccess());
		System.assertEquals('The Last Name "'+con.LastName+'" is not allowed for DML',save.getErrors()[0].getMessage());
    }
}