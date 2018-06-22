trigger trig on Contact (before insert) 
{
    
    TestSet__c t1 = TestSet__c.getInstance('Ankit');
    List<Contact> con = [SELECT FirstName, LastName FROM Contact WHERE Id IN : Trigger.new];
    String ln=t1.LastName__c;
    String fn=t1.FirstName__c;
    String mail=t1.Email__c;
    
    for(Contact co : con)
    {
        if((co.LastName==ln) && (co.FirstName==fn) )
        {  
          co.Email=mail;  
            System.debug('sucess');
        }
    }
    update con;
}