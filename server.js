// server.js
var express        = require('express');  
var app            = express();  
var httpServer = require("http").createServer(app);  
var five = require("johnny-five");  
var io=require('socket.io')(httpServer);
 
var port = 3000; 
 
app.use(express.static(__dirname + '/public'));
 
app.get('/', function(req, res) {  
        res.sendFile(__dirname + '/public/index.html');
});
 
httpServer.listen(port);  
console.log('Server available at http://localhost:' + port);  
var led1,led2,led3,led4;
var potentiometer;
var potValue;
var ledData;
 
//Arduino board connection
 
var board = new five.Board({port: "COM6"});  
board.on("ready", function() {  
    console.log('Arduino connected');
    Led1 = new five.Led(9);
    Led2 = new five.Led(10);
    Led3 = new five.Led(11);
    Led4 = new five.Led(12);
    potentiometer = new five.Sensor({
        pin: "A0",
        freq: 250
    })
      // Inject the `sensor` hardware into
  // the Repl instance's context;
  // allows direct command line access
  board.repl.inject({
    pot: potentiometer
  });
/*
    potentiometer.on("data", function(){
    potValue = this.value;
    //console.log(potValue);
    });
*/
});

//Socket connection handler
io.on('connection', function (socket) {  
        console.log(socket.id);
 
        socket.on('led:on', function (data) {
          ledData = data;
            switch(ledData){
              case 'Led1':
                Led1.on();
                console.log(ledData);
                break;
              case 'Led2':
                Led2.on();
                console.log(ledData);
                break;
                case 'Led3':
                Led3.on();
                console.log(ledData);
                break;
              case 'Led4':
                Led4.on();
                console.log(ledData);
                break;
            }                   
          console.log('LED ON RECEIVED');
          io.sockets.emit('led:on', {value: ledData});
        });
 
        socket.on('led:off', function (data) {
          ledData = data;
            switch(ledData){
              case 'Led1':
                Led1.off();
                console.log(ledData);
                break;
              case 'Led2':
                Led2.off();
                console.log(ledData);
                break;
                case 'Led3':
                Led3.off();
                console.log(ledData);
                break;
              case 'Led4':
                Led4.off();
                console.log(ledData);
                break;
            }
            console.log('LED OFF RECEIVED');
            io.sockets.emit('led:off', {value: ledData});
        });

        potentiometer.on("data", function(){
            potValue = this.value;
            io.sockets.emit('potentiometer', {value: potValue});

    //console.log(potValue);
    });

        socket.emit('potentiometer', {value: potValue});
    });
 
console.log('Waiting for connection');