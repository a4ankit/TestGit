@isTest
private class A_TemperatureConverterTest {

    @isTest static void testWarmTemp() {
        Decimal celsius = A_TemperatureConverter.FahrenheitToCelsius(70);
        System.assertEquals(21.11,celsius);
    }
    
    @isTest static void testFreezingPoint() {
        Decimal celsius = A_TemperatureConverter.FahrenheitToCelsius(32);
        System.assertEquals(0,celsius);
    }

    @isTest static void testBoilingPoint() {
        Decimal celsius = A_TemperatureConverter.FahrenheitToCelsius(212);        
        System.assertEquals(100,celsius,'Boiling point temperature is not expected.');
    } 
    
    @isTest static void testNegativeTemp() {
        Decimal celsius = A_TemperatureConverter.FahrenheitToCelsius(-10);
        System.assertEquals(-23.33,celsius);
    }
    
    @isTest static void testTemp(){
        Decimal celsius = A_TemperatureConverter.FahrenheitToCelsius(32);
        System.assertEquals(0, celsius);
    }
}