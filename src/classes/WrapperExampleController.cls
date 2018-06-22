//
// Custom controller for wrapper example
//
public with sharing class WrapperExampleController 
{
    // the list of accounts that will be displayed in the page
    private List<Account> accs;
    
    // the list of row wrappers that contain a transposed view of the account
    private List<RowWrapper> rows;
    
    // the headings for the row wrappers table
    private RowWrapper headings;
    
    // retrieves the list of accounts backing the page
    public List<Account> getAccounts()
    {
        if (null==accs)
        {
            accs=[select id, Name, BillingStreet, BillingCity, BillingPostalCode from Account 
                  where BillingCity != null and BillingPostalCode!=null limit 3];
        }
        
        return accs; 
    }
    
    // retrieves the row wrapper containing the wrapped account headings
    public RowWrapper getHeadWrap()
    {
        // set up the headings
        if (null==headings)
        {
            headings=new RowWrapper();
            for (Integer idx=1; idx<=getAccounts().size(); idx++)
            {
                headings.addValue('Account ' + idx);
            }
        }
                                     
        return headings;
    }
    
    // retrieves the list of row wrappers
    public List<RowWrapper> getRowWrappers()
    {
        if (null==rows)
        {
            rows=new List<RowWrapper>();
            
            // create a row for each field - there are 4 of these, Name, Street, City and PostCode
            for (Integer idx=0; idx<4; idx++)
            {
                rows.add(new RowWrapper());
            }
            
            // iterate the accounts and populate the rows
            for (Integer idx=0; idx<getAccounts().size(); idx++)
            {
                rows[0].addValue(getAccounts()[idx].Name);
                rows[1].addValue(getAccounts()[idx].BillingStreet);
                rows[2].addValue(getAccounts()[idx].BillingCity);
                rows[3].addValue(getAccounts()[idx].BillingPostalCode);
            }
        }
        
        return rows;
    }
    
    // nested class that wraps information about a row - in this case simply a list of strings 
    public class RowWrapper
    {
        // the values (cells) making up this row
        public List<String> values {get; set;}
        
        // constructor
        public RowWrapper()
        {
            values=new List<String>();
        }
        
        // append a value (cell) to the row
        public void addValue(String value)
        {
            values.add(value);
        }
    }
    }