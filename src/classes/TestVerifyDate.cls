@isTest
private class TestVerifyDate 
{
	@isTest	static void CheckDates()
    {
       date d1 = VerifyDate.CheckDates( (Date.newInstance(2017, 11, 9)),  (Date.newInstance(2017, 11, 12)));
       date d2 = VerifyDate.CheckDates( (Date.newInstance(2017, 10, 9)),  (Date.newInstance(2017, 12, 30)));
       
       
    }
       
    	
    
}