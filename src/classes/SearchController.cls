public class SearchController 
{
    private apexpages.StandardController controller {get;set; }
    private account a;
    public list<account> searchResults {get;set; }
    public string searchtext
    {
        get
        {
            if(searchtext==null) searchtext='';
            return searchtext;
        }
        set;
    }
    public SearchController(apexpages.StandardController controller)
    {
        this.controller = controller;
        this.a = (account) controller.getRecord();
        
    }
    public PageReference search()
    {
        if(searchResults == null)
        {
            system.debug('searchResults in if'+searchResults);
            searchResults = new List<account>();
        }
        else
        {
            ApexPages.addmessage(new ApexPages.message(ApexPages.severity.WARNING,'Please enter correct value'));
            system.debug('searchResults in else'+searchResults);
            searchResults.Clear();
            return null;
        }
        
        String qry = 'Select Id, Name from account where name like \'%'+searchtext+'%\' Order By Name';
        searchResults = Database.query(qry);
        system.debug('qry'+qry);
        return null;
    }
}