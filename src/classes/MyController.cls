public class MyController {
    ApexPages.StandardController sc;
    public Account acct{get;set;}
    public Integer count=2;
    public Integer selectedContact{get;set;}
    public List<WrapperClass> listContacts{get;set;}
    public MyController(ApexPages.StandardController controller) {
        this.acct = (Account)controller.getRecord();
        sc=controller;
        listContacts=new List<WrapperClass>();
        Contact c=new Contact();
        listContacts.add(new WrapperClass(c,1));
    }
    public PageReference deleteContact(){
        Integer x = -1;
        for(WrapperClass wc:listContacts){
            x++;
            if(wc.counter==selectedContact){
                System.debug('-->selected contact:'+selectedContact+'  position:'+x);
                break;
            }
        }
        listContacts.remove(x);
        return null;
    }
    public PageReference saveAccount(){
        Database.SaveResult sr = Database.insert(acct, false);
        Id idey=sr.getId();
        List<Contact> contactList=new List<Contact>();
        for(WrapperClass wc:listContacts){
            Contact c=new Contact();
            c.lastName=wc.c.lastName;
            c.firstName=wc.c.firstName;
            c.accountid=idey;
            contactList.add(c);
        }
        insert contactList;
        
        return null;
    }
    public PageReference addAContact(){
        
        Contact c=new Contact();
        listContacts.add(new WrapperClass(c,count));        
        count=count+1;
        return null;
    }
    public class WrapperClass{
        public Integer counter{get;set;}
        public Contact c{get;set;}
        public WrapperClass(Contact cntc,Integer i){
            this.c=cntc;
            this.counter=i;
        }
    }
}