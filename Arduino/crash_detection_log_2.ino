#include <SPI.h>
#include <SD.h>

const byte sensorPin = A0;
const byte ledPin = 2;
const byte cs = 10;

File file;

// -------- SETTINGS --------
const int threshold = 30;
const int cooldown = 3000;

unsigned long lastTrigger = 0;

// -------- VARIABLES --------
int baseline = 0;
bool initialized = false;

// -------- SETUP --------
void setup() {
  Serial.begin(9600);
  pinMode(ledPin, OUTPUT);

  randomSeed(analogRead(A1));

  if (!SD.begin(cs)) {
    Serial.println("SD fail");
  }

  if (!SD.exists("logs.csv")) {
    file = SD.open("logs.csv", FILE_WRITE);
    if (file) {
      file.println(F("timestamp,accX,accY,accZ,speed,tiltAngle,vibration"));
      file.close();
    }
  }

  Serial.println("Starting...");
}

// -------- LOOP --------
void loop() {

  int value = analogRead(sensorPin);

  // 🔹 initialize baseline once
  if (!initialized) {
    baseline = value;
    initialized = true;
  }

  // 🔹 slowly update baseline (handles drift)
  baseline = (baseline * 9 + value) / 10;

  // 🔹 shock = sudden deviation
  int shock = abs(value - baseline);

  // 🔹 noise filter
  if (shock < 20) shock = 0;

  // 🔹 SIMULATED ACCELERATION
  // 🔹 MAP SHOCK → ACCELERATION RANGE
int accX, accY, accZ;

// Normalize shock into bands
if (shock <= 10) {
  accX = random(3, 6);   // 3–5
  accY = random(3, 6);
  accZ = random(3, 6);
}
else if (shock <= 30) {
  accX = random(5, 9);   // 5–8
  accY = random(5, 9);
  accZ = random(5, 9);
}
else if (shock <= 60) {
  accX = random(8, 13);  // 8–12
  accY = random(8, 13);
  accZ = random(8, 13);
}
else {
  accX = random(12, 18); // high vibration
  accY = random(12, 18);
  accZ = random(12, 18);
}

  int tilt = random(0, 5);

  unsigned long t = millis();

  // 🔹 SERIAL OUTPUT
  Serial.print("Shock: ");
  Serial.print(shock);
  Serial.print(" | Raw: ");
  Serial.print(value);
  Serial.print(" | Base: ");
  Serial.print(baseline);
  Serial.print(" | Tilt: ");
  Serial.println(tilt);

  // 🔴 CRASH DETECTION
  if (shock > threshold && millis() - lastTrigger > cooldown) {
    lastTrigger = millis();

    digitalWrite(ledPin, HIGH);
    Serial.println("CRASH DETECTED");
  } else {
    digitalWrite(ledPin, LOW);
  }

  // 🔹 CSV LOGGING
  file = SD.open("logs.csv", FILE_WRITE);

  if (file) {
    file.print(t); file.print(',');

    file.print(accX); file.print(',');
    file.print(accY); file.print(',');
    file.print(accZ); file.print(',');

    file.print(40); file.print(',');
    file.print(tilt); file.print(',');

    file.println(shock);

    file.close();
  }

  delay(100);
}