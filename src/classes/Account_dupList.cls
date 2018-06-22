public class Account_dupList 
{
	public static List<Account> dupList()
    {
        List<Account> allRec= [SELECT Id,Name FROM ACCOUNT LIMIT 100];
        Set<String> unique = new Set<String>();
        List<Account> finalRecord = new List<Account>();
        for(Account acc : allRec)
        {
            if(!(unique.contains(acc.Name)))
            {
                unique.add(acc.name);
                finalRecord.add(acc);
            }
        }
        return finalRecord;
    }
}