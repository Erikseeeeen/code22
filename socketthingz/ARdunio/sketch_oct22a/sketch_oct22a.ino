#include <SPI.h>
#include <Ethernet.h>
#include <Adafruit_MAX31856.h>

Adafruit_MAX31856 thermo0 = Adafruit_MAX31856(5, 4, 3, 2);
Adafruit_MAX31856 thermo1 = Adafruit_MAX31856(6, 4, 3, 2);
byte mac[] = {
  0x2C, 0xF7, 0xF1, 0x08, 0x36, 0xDB
};
IPAddress ip(192, 168, 1, 177);


EthernetServer server(80);

unsigned int t = 0;
unsigned int t_0 = 0;
bool submerged = 1;
int yes;
void setup() {


  Serial.begin(9600);
  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB port only
  }
  Serial.println("Ethernet WebServer Example");
  
  thermo0.begin();
  thermo1.begin();
  thermo0.setThermocoupleType(MAX31856_TCTYPE_K);
  thermo1.setThermocoupleType(MAX31856_TCTYPE_K);
  thermo0.setConversionMode(MAX31856_CONTINUOUS);
  thermo1.setConversionMode(MAX31856_CONTINUOUS);
  
  // start the Ethernet connection and the server:
  Ethernet.begin(mac, ip);

  // Check for Ethernet hardware present
  if (Ethernet.hardwareStatus() == EthernetNoHardware) {
    Serial.println("Ethernet shield was not found.  Sorry, can't run without hardware. :(");
    while (true) {
      delay(1); // do nothing, no point running without Ethernet hardware
    }
  }
  if (Ethernet.linkStatus() == LinkOFF) {
    Serial.println("Ethernet cable is not connected.");
  }

  // start the server
  server.begin();
  Serial.print("server is at ");
  Serial.println(Ethernet.localIP());
  delay(100);
}


void loop() {
  while(submerged){
    Serial.println("submerged");
    yes = Serial.read();
    if(yes!=-1){
      submerged = 0;
    }
  }
  EthernetClient client = server.available();
  ////////////////////////////////////////////////////////////
  t_0 = millis()/10;
  client.println("START");
  client.println("BATTERY");
  client.println(86);
  ////////////////////////////////////////////////////////////
  t_0 = millis()/10;
  client.println("START");
  client.println("POSITION");
  client.print(63.430956);
  client.print(';');
  client.print(10.395863);
  ////////////////////////////////////////////////////////////
  t_0 = millis()/10;
  client.println("START");
  client.println("THERMO0");
  for (int i = 0; i<100; i++){
    float sensorReading = thermo0.readThermocoupleTemperature();
    //float sensorReading = 2.1;
    t = millis()/10-t_0;
    String s;
    s=s+t;
    s=s+';';
    s=s+thermo0.readThermocoupleTemperature();
    s=s+'\n';
    
    client.print(s); 
    if (Ethernet.linkStatus() == LinkOFF) {
      Serial.println("Ethernet cable is not connected.");
    }
  }
  ////////////////////////////////////////////////////////////
  t_0 = millis()/10;
  client.println("START");
  client.println("THERMO1");
  for (int i = 0; i<100; i++){
    float sensorReading = thermo1.readThermocoupleTemperature();
    t = millis()/10-t_0;
    String s;
    s=s+t;
    s=s+';';
    s=s+thermo0.readThermocoupleTemperature();
    s=s+'\n';
    
    client.print(s); 
    if (Ethernet.linkStatus() == LinkOFF) {
      Serial.println("Ethernet cable is not connected.");
    }
  }
  client.println("DONE");
  while(submerged==0){
    Serial.println("be floatin");
    yes = Serial.read();
    if(yes!=-1){
      submerged = 1;
    }
  }
  
}
