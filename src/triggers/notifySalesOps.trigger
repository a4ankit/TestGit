trigger notifySalesOps on UserTerritory2Association (after insert) 
{
    List<UserTerritory2Association> utaList = [SELECT Id, User.FirstName, User.LastName, 
                                               Territory2.Name, Territory2.Territory2Model.Name 
                                               FROM UserTerritory2Association WHERE Id IN :Trigger.New];
    
    Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
    mail.setToAddresses(new String[]{'ankitsharma.algoworks@gmail.com'}); 
    mail.setSubject('Users added to territories notification');     
    
    
    List<String> msgBody = new List<String>();
    
    String addedToTerrStr = '{0}, {1} added to territory {2} in model {3} \n';    
    msgBody.add('The following users were added to territories by ' +  
                UserInfo.getFirstName() + ', ' + UserInfo.getLastName() + '\n');
    
    for(UserTerritory2Association uta : utaList) 
    {
        msgBody.add(String.format(addedToTerrStr, 
                                  new String[]
                                  {
                                      uta.User.FirstName, uta.User.LastName,
                                          uta.Territory2.Name, uta.Territory2.Territory2Model.Name
                                          }));    
    } 
    
    mail.setPlainTextBody(String.join(msgBody,''));
    Messaging.sendEmail(new Messaging.Email[] { mail });
}