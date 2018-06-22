@isTest
public class TestDataContactUpdate 
{
	public static List<Account> createAccwithCon(Integer numAcc, Integer numCon)
    {
        List<Account> accList = new List<Account>();
        for(Integer i=0; i<numAcc; i++)
        {
         Account acc = new Account(Name ='Account'+i, BillingCity = 'New York', BillingCountry = 'USA');
         accList.add(acc);
        }
        insert accList;
        
        List<Contact> conList = new List<Contact>();
        for(Integer j=0;j<numAcc; j++)
        {
            Account acct = accList[j];
            for(Integer k=0;k<numCon; k++)
            {
                Contact con = new Contact(LastName='Last'+k, FirstName='First'+k, AccountId = acct.Id);
                conList.add(con);
            }
        }
        insert conList;
        
        return accList;
    }
}