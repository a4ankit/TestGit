trigger PreventContactDelete on Contact (before delete) 
{
    for(Contact con : Trigger.old)
    {
        con.addError('You can not delete Contact record');
    }
}