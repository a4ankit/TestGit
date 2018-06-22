public class convertToCLA {
    List<Contact> contacts;
    List<Lead> leads;
    List<Account> accounts;
    
    public void convertType(Integer phoneNumber) {
        List<List<sObject>> results = [FIND '4155557000' 
                                       IN Phone FIELDS 
                                       RETURNING Contact(Id, Phone, FirstName, LastName), 
                                       Lead(Id, Phone, FirstName, LastName), Account(Id, Phone, Name)];
        sObject[] records = ((List<sObject>)results[0]);
        
        if (!records.isEmpty()) {
            for (Integer i = 0; i < records.size(); i++) {
                sObject record = records[i];
                if (record.getSObjectType() == Contact.sObjectType) {
                    contacts.add((Contact) record);
                } else if (record.getSObjectType() == Lead.sObjectType){
                    leads.add((Lead) record);
                } else if (record.getSObjectType() == Account.sObjectType) {
                    accounts.add((Account) record);
                }
            }
        }  
    }
}