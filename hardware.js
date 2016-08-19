var Firebase = require("firebase");
var five = require("johnny-five"), button, photoresistor, board;
board = new five.Board();

// Temperature
var firebaseTempCRef = new Firebase(
  "https://smarthomedenver.firebaseio.com/temperatureC"
);

var firebaseTempFRef = new Firebase(
  "https://smarthomedenver.firebaseio.com/temperatureF"
);

// Doors
var firebaseDoorsRef = new Firebase(
  "https://smarthomedenver.firebaseio.com/doors"
);

// Lights
var firebaseLightsRef = new Firebase(
  "https://smarthomedenver.firebaseio.com/lights"
);

board.on("ready", function() {
  var led = new five.Led(13);

  // New button
  button = new five.Button(2);

  // New temp sensor
  var temp = new five.Thermometer({
    controller: "LM35",
    pin: "A0"
  });

  // New light sensor
  var photoresistor = new five.Sensor({
    pin: "A1",
    freq: 20
  });

  // Button
  board.repl.inject({
    button: button
  });

  button.on("down", function() {
    led.on();
    firebaseDoorsRef.set({'doors': 'open'});
  });

  button.on("up", function() {
    led.off();
    firebaseDoorsRef.set({'doors': 'closed'});
  });

  /* ************************************************************* */

  // Temperature
  temp.on("change", function() {
    firebaseTempCRef.set({ 'temperature': this.celsius });
    firebaseTempFRef.set({ 'temperature': this.fahrenheit });
  });

  /* ************************************************************* */

  // Lights
  board.repl.inject({
    pot: photoresistor
  });

  photoresistor.on('data', function() {
    firebaseLightsRef.set({ 'value': photoresistor.value });
  });

});
