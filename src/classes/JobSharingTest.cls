@isTest
private class JobSharingTest {
    // Test for the manualShareRead method
    static testMethod void testManualShareRead(){
        // Select users for the test.
        List<User> users = [SELECT Id FROM User WHERE IsActive = true LIMIT 2];
        Id User1Id = users[0].Id;
        Id User2Id = users[1].Id;
        
        // Create new job.
        Test__c j = new Test__c();
        j.Name = 'Test Job';
        j.OwnerId = user1Id;
        insert j;    
        
        // Insert manual share for user who is not record owner.
        System.assertEquals(JobSharing.manualShareRead(j.Id, user2Id), true);
        
        // Query job sharing records.
        List<Test__Share> jShrs = [SELECT Id, UserOrGroupId, AccessLevel, 
                                   RowCause FROM Test__share WHERE ParentId = :j.Id AND UserOrGroupId= :user2Id];
        
        // Test for only one manual share on job.
        System.assertEquals(jShrs.size(), 1, 'Set the object\'s sharing model to Private.');
        
        // Test attributes of manual share.
        System.assertEquals(jShrs[0].AccessLevel, 'Read');
        System.assertEquals(jShrs[0].RowCause, 'Manual');
        System.assertEquals(jShrs[0].UserOrGroupId, user2Id);
        //System.assertEquals(jShrs[0].ParentId, j.Id);
        
        // Test invalid job Id.
        delete j;   
        
        // Insert manual share for deleted job id. 
        System.assertEquals(JobSharing.manualShareRead(j.Id, user2Id), false);
        //system.assert(ApexPages.hMessages(), 'There should be an error');
    }  
}