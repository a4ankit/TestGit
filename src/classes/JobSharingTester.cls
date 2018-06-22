@isTest
private class JobSharingTester {    
    // Test for the JobSharingRecalc class    
    static testMethod void testApexSharing(){
        // Instantiate the class implementing the Database.Batchable interface.     
        JobSharingRecalc recalc = new JobSharingRecalc();
        
        // Select users for the test.
        List<User> users = [SELECT Id FROM User WHERE IsActive = true LIMIT 2];
        ID User1Id = users[0].Id;
        ID User2Id = users[1].Id;
        
        // Insert some test job records.                 
        List<Job__c> testJobs = new List<Job__c>();
        for (Integer i=0;i<5;i++) {
            Job__c j = new Job__c();
            j.Name = 'Test Job ' + i;
            j.Recruiter__c = User1Id;
            j.Hiring_Manager__c = User2Id;
            testJobs.add(j);
        }
        insert testJobs;
        
        Test.startTest();
        
        // Invoke the Batch class.
        String jobId = Database.executeBatch(recalc);
        
        Test.stopTest();
        
        // Get the Apex job and verify there are no errors.
        AsyncApexJob aaj = [Select JobType, TotalJobItems, JobItemsProcessed, Status, 
                            CompletedDate, CreatedDate, NumberOfErrors 
                            from AsyncApexJob where Id = :jobId];
        System.assertEquals(0, aaj.NumberOfErrors);
        
        // This query returns jobs and related sharing records that were inserted       
        // by the batch job's execute method.     
        List<Job__c> jobs = [SELECT Id, Hiring_Manager__c, Recruiter__c, 
                             (SELECT Id, ParentId, UserOrGroupId, AccessLevel, RowCause FROM Shares 
                              WHERE (RowCause = :Schema.Job__Share.rowCause.Recruiter__c OR 
                                     RowCause = :Schema.Job__Share.rowCause.Hiring_Manager__c))
                             FROM Job__c];       
        
        // Validate that Apex managed sharing exists on jobs.     
        for(Job__c job : jobs){
            // Two Apex managed sharing records should exist for each job
            // when using the Private org-wide default. 
            System.assert(job.Shares.size() == 2);
            
            for(Job__Share jobShr : job.Shares){
                // Test the sharing record for hiring manager on job.             
                if(jobShr.RowCause == Schema.Job__Share.RowCause.Hiring_Manager__c){
                    System.assertEquals(jobShr.UserOrGroupId,job.Hiring_Manager__c);
                    System.assertEquals(jobShr.AccessLevel,'Read');
                }
                // Test the sharing record for recruiter on job.
                else if(jobShr.RowCause == Schema.Job__Share.RowCause.Recruiter__c){
                    System.assertEquals(jobShr.UserOrGroupId,job.Recruiter__c);
                    System.assertEquals(jobShr.AccessLevel,'Edit');
                }
            }
        }
    }
}