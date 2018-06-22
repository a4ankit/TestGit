trigger ClosedOpportunityTrigger on Opportunity (after insert, after update) 
{
	List<Task> newTaskList = new List<Task>();
    for(Opportunity opp : [Select Id FROM Opportunity WHERE StageName = 'Closed Won' AND Id IN : Trigger.new])
    {
          Task newTask = new Task(Subject='Follow Up Test Task', WhatId=opp.Id);
          newTaskList.add(newTask);
    }
    insert newTaskList;
}