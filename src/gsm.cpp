#include <Arduino.h>

// Define pins for GSM Module communication
// We use 18 and 19 because 16 and 17 are reserved for your GPS module
#define GSM_RX_PIN 18
#define GSM_TX_PIN 19

// Use HardwareSerial 1 for the GSM module
HardwareSerial GSM_SERIAL(1);

// REPLACE THIS with the actual phone number you want to send the message to (include country code)
const String TARGET_PHONE_NUMBER = "+918093582428"; 

void updateSerial() {
  // Pass data from GSM to Serial Monitor
  while (GSM_SERIAL.available()) {
    Serial.write(GSM_SERIAL.read());
  }
  // Pass data from Serial Monitor to GSM
  while (Serial.available()) {
    GSM_SERIAL.write(Serial.read());
  }
}

void setup() {
  // Start PC Serial Monitor
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("===================================");
  Serial.println("   GSM Module Test (SIM800L/900)   ");
  Serial.println("===================================");
  
  // Start GSM Serial
  GSM_SERIAL.begin(9600, SERIAL_8N1, GSM_RX_PIN, GSM_TX_PIN);
  
  Serial.println("Warming up GSM module (wait 15 seconds for network connection)...");
  delay(15000);

  // 1. Test basic AT command communication
  Serial.println("Testing AT Command...");
  GSM_SERIAL.println("AT");
  delay(1000);
  updateSerial();

  // 2. Set SMS format to Text Mode
  Serial.println("Setting to Text Mode (AT+CMGF=1)...");
  GSM_SERIAL.println("AT+CMGF=1");
  delay(1000);
  updateSerial();

  // 3. Command to send SMS
  Serial.println("Sending SMS to " + TARGET_PHONE_NUMBER + "...");
  GSM_SERIAL.print("AT+CMGS=\"");
  GSM_SERIAL.print(TARGET_PHONE_NUMBER);
  GSM_SERIAL.println("\"");
  delay(1000);
  updateSerial();
  
  // 4. Message Content
  GSM_SERIAL.print("Alert! This is a test message from the Smart Helmet ESP32.");
  delay(500);
  updateSerial();

  // 5. Send Ctrl+Z to finish and send the message
  Serial.println("Sending Ctrl+Z to dispatch message...");
  GSM_SERIAL.write(26); 
  
  Serial.println("Wait for 'CMGS' confirmation (can take a few seconds)...");
}

void loop() {
  // Keep the serial bridge open so you can read the success/error response
  // or type your own AT commands in the Serial Monitor!
  updateSerial();
}
