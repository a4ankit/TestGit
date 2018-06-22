global with sharing class HotelRemoter {
    @RemoteAction
    global static List<Hotel__c> findAll() {
        return [SELECT Id, Name, Location__Latitude__s, Location__Longitude__s
                    FROM Hotel__c];

    }
    
}

/*
 * <iframe src="https://fortress.maptive.com/ver4/be5f4b8707f24c21590826a082d07e81" 
 * frameborder="0" width="700" height="500" allow="geolocation"></iframe>
 * */