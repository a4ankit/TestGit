trigger AccountDeletion on Account (before delete) 
{
	for(Account a : [Select Id From Account
                     Where Id IN (Select AccountId From Opportunity) And
                    Id In : Trigger.old]){
        			Trigger.oldMap.get(a.Id).addError('can not delete account with related opportunity');
    }
}