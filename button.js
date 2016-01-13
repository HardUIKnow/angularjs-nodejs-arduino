var five = require("johnny-five");
var board = new five.Board({port:"COM6"});

board.on("ready", function(){
  var directions = {
    up: { pin: 2, value: null },
    right: { pin: 3, value: null },
    left: { pin: 4, value: null },
    down: { pin: 5, value: null },
  };

  Object.keys(directions).forEach(function(key) {
    var pin = directions[key].pin;

    this.pinMode(pin, five.Pin.INPUT);
    this.digitalRead(pin, function(data) {
      // Catpure the initial pin value
      if (directions[key].value === null) {
        directions[key].value = data;
      }

      // Something changed
      if (directions[key].value !== data) {
        console.log(pin, key);
      }

      directions[key].value = data;
    });
  }, this);
});