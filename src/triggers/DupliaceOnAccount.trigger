trigger DupliaceOnAccount on Account (before insert, before update) 
{
    Set<String> List1 = new Set<String>();
    List<Account> List2 = [Select name from Account];
    for(Account A: List2)
    {
        List1.add(A.name);
    }
    for(Account L1:Trigger.new)
    {
        if(List1.contains(L1.name))
        {
            L1.addError('Record with the name is already exists');
        }
    }
}