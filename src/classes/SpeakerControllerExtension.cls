public with sharing class SpeakerControllerExtension 
{
    public Integer counter {get; set;}
    public Integer decounter {get;set;}
    public blob picture {get;set;}
    public string errorMessage {get;set;}
    private final Speaker__c speaker;
    private ApexPages.StandardController stdController;
    public SpeakerControllerExtension(ApexPages.StandardController stdController) 
    {
        this.speaker = (Speaker__c)stdController.getRecord();
        this.stdController = stdController;
        counter = 0;
        decounter = -1;
    }
    public void increment()
    {
        counter++;
    }
    public void decrement()
    {
        decounter--;
    }
    public PageReference save()
    {
        errorMessage='';
        try
        {
            upsert speaker;
            if(picture != null)
            {
                Attachment attachment = new Attachment();
                attachment.Body = picture;
                attachment.Name = 'speaker_' + speaker.id + '.jpg';
                attachment.ParentId = speaker.Id;
                attachment.ContentType = 'application/jpg';
                insert attachment;
                speaker.Picture_Path__c = '/servlet/servlet.FileDownload?file='+ attachment.id;
                update speaker;
            }
            return new ApexPages.StandardController(speaker).view();
        }
        catch(System.Exception ex)
        {
            errorMessage = ex.getMessage();
            return null;
        }
        
    }
    
}