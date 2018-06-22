@isTest
public class TestObjectList 
{
    /*@isTest static void testcontactList()
    {
        Boolean checked;
        Contact c;
        List<Account> accountList = new List<Account>();
        List<Contact> contactList = new List<Contact>();
        for(Integer i=0;i<10;i++)
        {
            accountList.add(new Account(name='Account'+i));
        }
        insert accountList;
        for(Account account : accountList)
        {
            contactList.add(new contact(FirstName = 'first', LastName='last', Email = 'abc@gmail.com', Phone='95585755454', AccountId = account.id ));
        }
        insert contactList;
        Test.startTest();
        List<ObjectList.WrapContact> cl;
        ObjectList.WrapContact testwrap = new ObjectList.WrapContact(c,true);
        ObjectList ol = new ObjectList();
        ol.getDetails();
        ol.DeleteChecked();
        Test.stopTest();
    } */
    @isTest static void testcontactList2(){
        Account obj = new Account(Name = 'TestAcc');
        insert obj;
        Account obj2 = new Account(Name = 'TestAcc',ParentId = obj.id);
        insert obj2;
        Contact con = new contact(FirstName = 'first', LastName='last', Email = 'abc@gmail.com', Phone='95585755454', AccountId = obj.id);
        insert con;
        ObjectList ol = new ObjectList();
        ObjectList.WrapContact testwrap = new ObjectList.WrapContact(con,true);
        ol.objAccount = obj2;
        ol.getDetails();
        ol.DeleteChecked();
    }
}