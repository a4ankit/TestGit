public class AccountHelper 
{
    @AuraEnabled 
    public static Account[] getAccounts() 
    {
        return [Select Id, Name, AccountNumber,Phone, BillingCity, 
                AccountSource, Site, AnnualRevenue, NumberOfEmployees 
                from Account Limit 100];
    }
    @AuraEnabled 
    public static Account[] getPopAccounts() 
    {
        return [Select Id, Name, AccountNumber,Phone, BillingCity, 
                AccountSource, Site, AnnualRevenue, NumberOfEmployees 
                from Account ];
    }
    @AuraEnabled
    public static Account saveAccount(Account account) {
        system.debug('account'+account);
        //Account accName = [SELECT Id, Name FROM Account WHERE Name = :account.Name ];
        update account;
        system.debug('account'+account);
        return account;
    }
    
    @AuraEnabled
    public static List < String > getselectOptions(Account objAcc, string fld) {
        system.debug('objObject --->' + objAcc);
        system.debug('fld --->' + fld);
        List < String > allOpts = new list < String > ();
        // Get the object type of the SObject.
        Schema.sObjectType objType = objAcc.getSObjectType();
        
        // Describe the SObject using its object type.
        Schema.DescribeSObjectResult objDescribe = objType.getDescribe();
        
        // Get a map of fields for the SObject
        map < String, Schema.SObjectField > fieldMap = objDescribe.fields.getMap();
        
        // Get the list of picklist values for this field.
        list < Schema.PicklistEntry > values =
            fieldMap.get(fld).getDescribe().getPickListValues();
        
        // Add these values to the selectoption list.
        for (Schema.PicklistEntry a: values) {
            allOpts.add(a.getValue());
        }
        system.debug('allOpts ---->' + allOpts);
        allOpts.sort();
        return allOpts;
    }
    @AuraEnabled
    public static Account deleteAccount(Account recordId) {
        //delete account;
        return recordId;
    }
    @AuraEnabled
    public static List<Account> getAccount(Integer limits , Integer offsets){
        System.debug('limits'+limits);
        System.debug('offsets'+offsets);
        Integer intlimits = integer.valueof(limits);
        Integer intoffsets = integer.valueof(offsets);
        List<Account> AccountList = [Select Id, Name, AccountNumber,Phone, BillingCity, 
                                     AccountSource, Site, AnnualRevenue, NumberOfEmployees 
                                     from Account  
                                     Limit :intlimits Offset :intoffsets];
        return AccountList;
    }
    
    @AuraEnabled
    public static List<Account> findByName(String searchKey, Account[] accList) 
    {
        Set<Id> recordIds = new Map<Id, Account>(getAccounts()).keySet();
        system.debug('ACCOUNT LIST' + accList);
        String name = '%' + searchKey + '%';
        return [Select Id, Name, AccountNumber, AccountSource,Phone, BillingCity, Site, AnnualRevenue, NumberOfEmployees 
                from Account 
                WHERE (Name LIKE :name OR AccountNumber LIKE :name OR Site LIKE :name OR AccountSource LIKE :name) 
                AND Id IN:recordIds];
    }
    
    @AuraEnabled
    public static Id saveChunk(Id parentId, String fileName, String base64Data, String contentType, String fileId) 
    {
        // check if fileId id ''(Always blank in first chunk), then call the saveTheFile method,
        //  which is save the check data and return the attachemnt Id after insert, 
        //  next time (in else) we are call the appentTOFile() method
        //   for update the attachment with reamins chunks   
        if (fileId == '') 
        {
            fileId = saveTheFile(parentId, fileName, base64Data, contentType);
        } else 
        {
            appendToFile(fileId, base64Data);
        }
        
        return Id.valueOf(fileId);
    }
    public static Id saveTheFile(Id parentId, String fileName, String base64Data, String contentType) 
    {
        base64Data = EncodingUtil.urlDecode(base64Data, 'UTF-8');
        Attachment oAttachment = new Attachment();
        oAttachment.parentId = parentId;
        oAttachment.Body = EncodingUtil.base64Decode(base64Data);
        oAttachment.Name = fileName;
        oAttachment.ContentType = contentType;
        
        insert oAttachment;
        return oAttachment.Id;
    }
    private static void appendToFile(Id fileId, String base64Data) 
    {
        base64Data = EncodingUtil.urlDecode(base64Data, 'UTF-8');
        
        Attachment a = [
            SELECT Id, Body
            FROM Attachment
            WHERE Id =: fileId
        ];
        
        String existingBody = EncodingUtil.base64Encode(a.Body);
        
        a.Body = EncodingUtil.base64Decode(existingBody + base64Data);
        
        update a;
    }
    @AuraEnabled
    public static List<Account> importCSVFileToInsert(String b64string)
    {
        Set<Id> successfulAccountIds = new Set<Id>();
        Set<Id> allAccountIds = new Set<Id>();
        Set<Id> failedAccountIds = new Set<Id>();
        system.debug('blobvalue--->'+b64string);
        String[] filelines;
        String nameFile;
        String tempb64string = b64string.removeStart('data:text/csv;base64,');
        Blob contentFile = EncodingUtil.base64Decode(tempb64string);
        system.debug('contentFile-->'+contentFile);
        nameFile=contentFile.toString();
        system.debug('nameFile-->'+nameFile);
        filelines = nameFile.split('\n');
        system.debug('filelines-->'+filelines);
        List<Account> contoupload = new List<Account>();
        List<Account> alist = new List<Account>();
        try{
            for(Integer i=1;i<filelines.size();i++)
            {
                system.debug('filelines.size()'+filelines.size());
                String[] inputvalues = new String[]{};
                    inputvalues = filelines[i].split(','); 
                Account a = new Account();
                a.Name = inputvalues[0]; 
                a.Phone = inputvalues[1];       
                a.BillingCity = inputvalues[2];
                a.Description = inputvalues[3];
                contoupload.add(a);
                System.debug('allAccountIds--->'+allAccountIds);
                System.Debug('Account Entry'+contoupload.size());    
            }
            if(contoupload.size()>0)
            {
                Database.SaveResult[] srList = Database.insert(contoupload, false);
                System.Debug('FileSize12311'+contoupload.size());
                for(integer i=0; i<srList.size(); i++) 
                {
                    
                    if (!srList[i].isSuccess()) 
                    {
                        String[] inputvalues = new String[]{};
                            inputvalues = filelines[i+1].split(',');
                        system.debug('inputvalues--->'+inputvalues);
                        Account acc = new Account();
                        acc.Name = inputvalues[0];
                        acc.Phone = inputvalues[1];       
                        acc.BillingCity = inputvalues[2];
                        acc.Description = inputvalues[3];
                        alist.add(acc);
                        system.debug('Failed List--->'+ alist);
                    }
                    else
                    {      
                    }  
                }
                
            }
        }
        catch (Exception e)
        {  
        }
        return alist;   
    }
}