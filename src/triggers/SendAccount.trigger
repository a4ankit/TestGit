trigger SendAccount on Account (after insert) {
    for(Account a:Trigger.new){
        SendAccountUsingRestApi.createAccount(a.name);
    }
}