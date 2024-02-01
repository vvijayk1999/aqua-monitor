#include <ESP8266WiFi.h>
#include <WebSocketsClient.h>
#include <NTPClient.h>
#include <WiFiUdp.h>
#include <Ultrasonic.h>

const char* ssid = "<SSID>";
const char* password = "<PASSWORD>";
const char* webSocketServer = "<SOCKET_URL>";
const int webSocketPort = 8080;
const String deviceId = "<DEVICE_ID>";

// GPIO pins numbers
const int trigPin = 14;  // D5
const int echoPin = 12;  // D6
const int flowPin = 4;   // D2

// Tank Dimensions
const int tankHeight = 30;
const int tankRadius = 14;

// defines variables
int tankVolume;
int distance;
int waterVolume;

unsigned long currentTime;
unsigned long loopTime;

byte sensorInterrupt = 0;  // 0 = digital pin 2
float calibrationFactor = 4.5;
volatile byte pulseCount;
float flowRate;
unsigned int flowMilliLitres;
unsigned int totalMilliLitres;
unsigned long oldTime;

WebSocketsClient webSocket;
Ultrasonic ultrasonic(trigPin, echoPin);  // Trig and Echo
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org");

void connection() {
  WiFi.begin(ssid, password);

  // Connect WIFI
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("Connecting to WiFi..");
  }
  Serial.println("Connected to the WiFi network");

  // Connect to Time client
  timeClient.begin();
  while (!timeClient.update()) {
    timeClient.forceUpdate();
  }
  Serial.println("Current date and time:");
  Serial.println(timeClient.getFormattedTime());

  // Connect to web server via web socket
  webSocket.begin(webSocketServer, webSocketPort, "/");
  webSocket.onEvent(webSocketEvent);
  while (!webSocket.isConnected()) {
    webSocket.loop();
  }
  Serial.println("Connected to WebSocket Server");
}

void waterLevel() {
  // Distance between the sensor to the water level
  distance = ultrasonic.read();

  // Calculate the water volume
  waterVolume = tankVolume - (3.14 * sq(tankRadius) * (distance));

  if (waterVolume < 0) {
    waterVolume = 0;
  }
}

void waterflow() {
  if ((millis() - oldTime) > 1000)  // Only process counters once per second
  {
    // Disable the interrupt while calculating flow rate
    detachInterrupt(sensorInterrupt);

    flowRate = ((1000.0 / (millis() - oldTime)) * pulseCount) / calibrationFactor;

    oldTime = millis();

    flowMilliLitres = (flowRate / 60) * 1000;
    totalMilliLitres += flowMilliLitres;

    pulseCount = 0;

    // Enable the interrupt again now that we've finished calculating
    attachInterrupt(sensorInterrupt, pulseCounter, FALLING);
  }
}

ICACHE_RAM_ATTR void pulseCounter() {
  // Increment the pulse counter
  pulseCount++;
}

void webSocketEvent(WStype_t eventType, uint8_t* payload, size_t length) {
  switch (eventType) {
    case WStype_DISCONNECTED:
      Serial.println("Disconnected from WebSocket Server");
      break;
    case WStype_CONNECTED:
      Serial.println("Connected to WebSocket Server");
      break;
    case WStype_TEXT:
      Serial.println("Received message from WebSocket Server");
      break;
  }
}

void setup() {
  Serial.begin(9600);

  // Connet to Wifi, Time Client, and Web Socket
  connection();

  attachInterrupt(digitalPinToInterrupt(flowPin), pulseCounter, RISING);

  // Calculate the total volume of the tank
  tankVolume = 3.14 * sq(tankRadius) * tankHeight;

  loopTime = millis();
}

String getTimeRFC3339() {
  // Update the NTP client
  timeClient.update();

  // Get the current formatted time directly from the NTP client
  String formattedTime = timeClient.getFormattedTime();
  
  return formattedTime;
}

void loop() {

  currentTime = millis();
  if (currentTime >= (loopTime + 5000)) {

    // Disable the interrupt while calculating water level and sending the data
    detachInterrupt(sensorInterrupt);

    loopTime = currentTime;

    // Perform water lever calculation
    // Water level calculaton is performed every 5 seconds
    waterLevel();

    String data = "{\"timestamp\":\"" + String(getTimeRFC3339()) + "\",\"deviceId\":\"" + deviceId + "\",\"tankWaterVolume\":" + String(waterVolume) + ",\"waterConsumed\":" + String(totalMilliLitres) + "}";

    // Send data to the web server
    webSocket.sendTXT(data);

    // Print data to the Serial output
    Serial.println(data);

    // Reset water details for the nest iteration
    totalMilliLitres = 0;

    // Enable the interrupt again now that we've finished calculating water level and sent the data
    attachInterrupt(sensorInterrupt, pulseCounter, FALLING);
  }
  webSocket.loop();

  // Perform waterflow measurement
  waterflow();
}