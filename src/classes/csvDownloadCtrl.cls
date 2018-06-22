public class csvDownloadCtrl {
    @AuraEnabled
    public static list <contact> fetchContact(){
        
        List <contact> returnConList = new List < contact > ();
        
        for(contact con: [SELECT firstName, LastName, Department, MobilePhone From contact LIMIT 1000]) {
            returnConList.add(con);
        }
        return returnConList;
    }
}