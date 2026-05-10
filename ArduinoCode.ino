#include "DHT.h"


#define DHTPIN 6        
#define DHTTYPE DHT22   
#define LDRPIN A0       

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  
  Serial.begin(9600);
  Serial.println("Starting Smart Farm Sensor Test...");
  
  dht.begin();
}

void loop() {
 
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();

  
  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("Failed to read");
  } else {
    Serial.print("Temp: ");
    Serial.print(temperature);
    Serial.print(" °C  |  Humidity: ");
    Serial.print(humidity);
    Serial.print(" %  |  ");
  }


  int lightLevel = analogRead(LDRPIN);
  
  Serial.print("Light Level: ");
  Serial.println(lightLevel);
  delay(2000);
}
