@isTest
private class ParkLocatorTest {
    @isTest static void testCallout() {              
        // This causes a fake response to be generated
        Test.setMock(WebServiceMock.class, new ParkServiceMock());
        // Call the method that invokes a callout
        String country = 'India';
        System.assertEquals(new List<String>{'Germany','India', 'Japan', 'United States'},     ParkLocator.country(country)); 
    }
}