var j5 = require("johnny-five");
var board = new j5.Board({port: "COM6"});
var LEDPIN = 3;

board.on("ready", function(){
  var led = new j5.Led(LEDPIN);
  led.strobe();
});
