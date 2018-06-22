public class NewCaseListController 
{
    public List<Case> getNewCases()
    {
        List<Case> records = [Select Id, CaseNumber from Case Where Status ='New'];
        
    
     return records;
    }


}