@isTest
public class SpeakerControllerExtensionTest 
{
    @isTest
    public static void testfunctions()
    {        
        test.startTest();
        Speaker__c sp = new Speaker__c();
        insert sp;
        
        ApexPages.StandardController sc = new ApexPages.StandardController(sp);
        SpeakerControllerExtension sce = new SpeakerControllerExtension(sc);
        
        sce.picture= blob.valueOf('test');
        sce.increment();
        sce.decrement();
        sce.save();
        
        PageReference pageRef = Page.SpeakerForm;
        Test.setCurrentPageReference(pageRef);

        test.stopTest();
    }
}