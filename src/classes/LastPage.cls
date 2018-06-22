public with sharing class LastPage
{
    
    public PageReference redirect() 
    {
        PageReference pageRef;
        pageRef = new PageReference('/home/home.jsp');
        pageRef.setRedirect(true);
        return pageRef;  
    }
    
}