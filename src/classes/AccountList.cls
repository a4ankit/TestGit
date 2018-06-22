public with sharing class AccountList {
    public static List<Account> accountListToDisplay()
    {
        return[Select Id , Name, Phone,(select Email from contacts)  from Account];
    }

}