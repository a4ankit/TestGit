trigger AccountTrg on Account( after insert, after update )
{
    List<ObjectTerritory2Association> ters = new List<ObjectTerritory2Association>();
    
    for( Account a : trigger.new )
    {
        if( a.devsfdx__Territory__c != null
           && ( trigger.isInsert
               || ( trigger.isUpdate && trigger.oldMap.get( a.Id).devsfdx__Territory__c != a.devsfdx__Territory__c )
              )
          )
        {
            ObjectTerritory2Association terri = new ObjectTerritory2Association();
            ters.add( terri );
        }
    }
    
    if( ters.size() > 0 )
        insert ters;
}