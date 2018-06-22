trigger ShareWithReportingMng on Case (after insert, after update) 
{
    List<CaseShare> csShareList = new List<CaseShare>();
    system.debug('csShareList-->'+csShareList);
    for( Case cs : trigger.new ) {
        system.debug('cs-->'+cs);
        if( cs.Reports_to__c!= NULL ) {
            // Create a new caseShare object for each case where reports_to__c field is not NULL.
            CaseShare csShare = new CaseShare();
            // Give Read write access to that user for this particular case record.
            csShare.CaseAccessLevel = 'edit';
            // Assign case Id of case record.
            csShare.CaseId = cs.id;
            // Assign user id to grant read write access to this particular case record.
            csShare.UserOrGroupId = cs.Reports_to__c;
            
            csShareList.add( csShare );
        }
    }
    system.debug('csShareList'+csShareList);
    if( csShareList != null && csShareList.size() != 0 ) {
        try {
            insert csShareList;
        }catch( Exception e ) {
            trigger.new[0].Reports_to__c.addError('Error::::::'+e.getMessage());
        }
    }
}