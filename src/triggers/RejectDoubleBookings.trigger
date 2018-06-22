trigger RejectDoubleBookings on Session_Speaker__c (before insert, before update) {
	List<id> sessionid = new List<id>();
    List<id> speakerid = new List<id>();
    
    for(Session_Speaker__c related : trigger.new)
    {
        List<Session_Speaker__c> rl= [SELECT ID, Speaker__c, Session__c, Session__r.Session_Date__c from Session_Speaker__c ];
    }
    
    for(Session_Speaker__c relatedSpeakers : trigger.new )
    {
        
    }
    
}