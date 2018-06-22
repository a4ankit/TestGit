public with sharing class TableComponentController {
    @AuraEnabled
    public static List<Account> getAccounts()
    {
        return[select name, phone, type, industry, website from Account];
    }
    
    @AuraEnabled
    public static Account saveAccounts(Account Account) {
        // Perform isUpdatable() checking first, then
        upsert Account;
        return Account;
    }
}