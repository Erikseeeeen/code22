#include <SPI.h>
#include <Ethernet.h>


byte mac[] = {
  0x2C, 0xF7, 0xF1, 0x08, 0x36, 0xDB
};
IPAddress ip(192, 168, 1, 177);


EthernetServer server(80);

int t = 0;
int diff = 0;
int t0 = 0;

void setup() {

  Serial.begin(9600);
  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB port only
  }
  Serial.println("Ethernet WebServer Example");

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
}


void loop() {
  EthernetClient client = server.available();
  for (int analogChannel = 0; analogChannel < 6; analogChannel++) {
            int sensorReading = analogRead(analogChannel);
            t = millis();
            String s;
            s=s+analogChannel;
            s=s+sensorReading;
            s=s+t;
            client.println(s);
          }
  int deltaT = millis()-t0;
  t0=millis();
  Serial.print(" delta t = ");
  Serial.println(deltaT);
  if (Ethernet.linkStatus() == LinkOFF) {
    Serial.println("Ethernet cable is not connected.");
  }
          
}
