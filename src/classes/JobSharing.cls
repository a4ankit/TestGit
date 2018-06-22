public class JobSharing {
    
    public static boolean manualShareRead(Id recordId, Id userOrGroupId){
        // Create new sharing object for the custom object Job.
        Test__Share jobShr  = new Test__Share();
        
        // Set the ID of record being shared.
        jobShr.ParentId = 'a017F00000WcTQC';
        
        // Set the ID of user or group being granted access.
        jobShr.UserOrGroupId = '0057F000002wkp3';
        
        // Set the access level.
        jobShr.AccessLevel = 'Read';
        
        // Set rowCause to 'manual' for manual sharing.
        // This line can be omitted as 'manual' is the default value for sharing objects.
        jobShr.RowCause = Schema.Test__Share.RowCause.manual;
        
        // Insert the sharing record and capture the save result. 
        // The false parameter allows for partial processing if multiple records passed 
        // into the operation.
        Database.SaveResult sr = Database.insert(jobShr,false);
        
        // Process the save results.
        if(sr.isSuccess()){
            // Indicates success
            return true;
        }
        else {
            // Get first save result error.
            Database.Error err = sr.getErrors()[0];
            
            // Check if the error is related to trival access level.
            // Access level must be more permissive than the object's default.
            // These sharing records are not required and thus an insert exception is acceptable. 
            if(err.getStatusCode() == StatusCode.FIELD_FILTER_VALIDATION_EXCEPTION  && err.getMessage().contains('AccessLevel')){
                // Indicates success.
                return true;
            }
            else{
                // Indicates failure.
                return false;
            }
        }
    }
    
}