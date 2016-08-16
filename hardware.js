var Firebase = require("firebase");
var five = require("johnny-five"), button, photoresistor, board;
board = new five.Board();

// Temperature
var firebaseTempRef = new Firebase(
  "https://smarthomedenver.firebaseio.com/temperature"
);

// Doors
var firebaseDoorsRef = new Firebase(
  "https://smarthomedenver.firebaseio.com/doors"
);

// Lights
// var firebaseLightsRef = new Firebase(
//   "https://smarthomedenver.firebaseio.com/lights"
// );

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
//   var photoresistor = new five.Sensor({
//     pin: "A5",
//     freq: 20
//   });

  // Button
  board.repl.inject({
    button: button
  });

  led.on();

  button.on("down", function() {
    console.log('down');
    led.off();
    firebaseDoorsRef.set({'doors': 'closed'});
  });

  button.on("up", function() {
    console.log('up');
    led.on();
    firebaseDoorsRef.set({'doors': 'open'});
  });

  /* ************************************************************* */

  // Temperature
  temp.on("change", function() {
    firebaseTempRef.set({ 'fahrenheit': this.fahrenheit + "°F" });
  });

  /* ************************************************************* */

  // Lights
  // board.repl.inject({
  //   pot: photoresistor
  // });
  //
  // photoresistor.on('data', function() {
  //   firebaseLightsRef.set({ 'value': photoresistor.value });
  // });

});
